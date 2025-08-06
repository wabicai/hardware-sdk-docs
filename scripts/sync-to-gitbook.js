#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const TurndownService = require('turndown');

// GitBook API 客户端
class GitBookSync {
  constructor(apiToken, spaceId) {
    this.apiToken = apiToken;
    this.spaceId = spaceId;
    this.baseUrl = 'https://api.gitbook.com/v1';
  }

  async updatePage(pageId, content) {
    const response = await fetch(`${this.baseUrl}/spaces/${this.spaceId}/content/pages/${pageId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document: {
          nodes: this.convertMarkdownToGitBook(content)
        }
      })
    });

    if (!response.ok) {
      throw new Error(`GitBook API error: ${response.statusText}`);
    }

    return response.json();
  }

  convertMarkdownToGitBook(markdown) {
    // 转换 Markdown 到 GitBook 格式
    // 这里可以实现具体的转换逻辑
    const html = marked(markdown);
    const turndown = new TurndownService();
    
    // 添加 GitBook 特定的转换规则
    turndown.addRule('gitbookHint', {
      filter: function(node) {
        return node.classList && node.classList.contains('changelog-breaking');
      },
      replacement: function(content) {
        return `{% hint style="danger" %}\n💥 **Breaking Change**\n\n${content}\n{% endhint %}\n\n`;
      }
    });

    turndown.addRule('gitbookFeature', {
      filter: function(node) {
        return node.classList && node.classList.contains('changelog-feature');
      },
      replacement: function(content) {
        return `{% hint style="success" %}\n✨ **New Feature**\n\n${content}\n{% endhint %}\n\n`;
      }
    });

    return turndown.turndown(html);
  }
}

async function main() {
  const apiToken = process.env.GITBOOK_API_TOKEN;
  const spaceId = process.env.GITBOOK_SPACE_ID;

  if (!apiToken || !spaceId) {
    console.error('❌ Missing GitBook API credentials');
    process.exit(1);
  }

  const gitbook = new GitBookSync(apiToken, spaceId);
  
  try {
    // 读取提取的 changelog 数据
    const changelogData = JSON.parse(fs.readFileSync('./changelog-extract.json', 'utf8'));
    
    console.log('📚 Syncing changelog to GitBook...');
    
    // 更新各个版本的 changelog 页面
    for (const version of changelogData.versions) {
      console.log(`  📝 Updating ${version.version}...`);
      
      const content = formatChangelogForGitBook(version);
      await gitbook.updatePage(version.pageId || 'changelog', content);
      
      console.log(`  ✅ Updated ${version.version}`);
    }
    
    // 更新主 changelog 页面
    const mainContent = formatMainChangelogForGitBook(changelogData);
    await gitbook.updatePage('changelog', mainContent);
    
    console.log('🎉 Changelog sync completed successfully!');
    
  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  }
}

function formatChangelogForGitBook(version) {
  let content = `# Changelog - ${version.version}\n\n`;
  content += `**Release Date:** ${version.date}\n\n`;
  
  if (version.breaking && version.breaking.length > 0) {
    content += `{% hint style="danger" %}\n`;
    content += `💥 **Breaking Changes**\n\n`;
    version.breaking.forEach(change => {
      content += `- ${change}\n`;
    });
    content += `{% endhint %}\n\n`;
  }
  
  if (version.features && version.features.length > 0) {
    content += `## ✨ New Features\n\n`;
    version.features.forEach(feature => {
      content += `- ${feature}\n`;
    });
    content += `\n`;
  }
  
  if (version.fixes && version.fixes.length > 0) {
    content += `## 🐛 Bug Fixes\n\n`;
    version.fixes.forEach(fix => {
      content += `- ${fix}\n`;
    });
    content += `\n`;
  }
  
  if (version.improvements && version.improvements.length > 0) {
    content += `## 🔧 Improvements\n\n`;
    version.improvements.forEach(improvement => {
      content += `- ${improvement}\n`;
    });
    content += `\n`;
  }

  return content;
}

function formatMainChangelogForGitBook(changelogData) {
  let content = `# Changelog\n\n`;
  content += `Last updated: ${new Date().toISOString().split('T')[0]}\n\n`;
  
  content += `## Latest Releases\n\n`;
  
  changelogData.versions.slice(0, 5).forEach(version => {
    content += `### [${version.version}](./changelog-${version.version.replace(/\./g, '-')})\n`;
    content += `*Released: ${version.date}*\n\n`;
    
    if (version.highlights && version.highlights.length > 0) {
      content += `**Highlights:**\n`;
      version.highlights.forEach(highlight => {
        content += `- ${highlight}\n`;
      });
      content += `\n`;
    }
  });
  
  content += `\n## All Versions\n\n`;
  content += `{% tabs %}\n`;
  
  const years = [...new Set(changelogData.versions.map(v => v.date.split('-')[0]))];
  
  years.forEach(year => {
    content += `{% tab title="${year}" %}\n`;
    const yearVersions = changelogData.versions.filter(v => v.date.startsWith(year));
    
    yearVersions.forEach(version => {
      content += `- [${version.version}](./changelog-${version.version.replace(/\./g, '-')}) - ${version.date}\n`;
    });
    
    content += `{% endtab %}\n\n`;
  });
  
  content += `{% endtabs %}\n`;
  
  return content;
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { GitBookSync };