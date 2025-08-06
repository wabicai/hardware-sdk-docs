const express = require('express');
const crypto = require('crypto');
const { GitBookSync } = require('./sync-to-gitbook');

const app = express();
const PORT = process.env.PORT || 3000;
const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

app.use(express.json());

// GitHub Webhook 验证
function verifySignature(payload, signature) {
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  hmac.update(payload);
  const digest = `sha256=${hmac.digest('hex')}`;
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

// 处理 GitHub push 事件
app.post('/webhook/github', async (req, res) => {
  const signature = req.headers['x-hub-signature-256'];
  
  if (!verifySignature(JSON.stringify(req.body), signature)) {
    return res.status(401).send('Unauthorized');
  }

  const { commits, ref } = req.body;
  
  // 只处理主分支的推送
  if (ref !== 'refs/heads/main') {
    return res.status(200).send('Ignored non-main branch');
  }

  // 检查是否有 changelog 文件变更
  const hasChangelogChanges = commits.some(commit => 
    commit.modified.some(file => 
      file.includes('CHANGELOG') || file.includes('changelog')
    ) ||
    commit.added.some(file => 
      file.includes('CHANGELOG') || file.includes('changelog')
    )
  );

  if (!hasChangelogChanges) {
    return res.status(200).send('No changelog changes detected');
  }

  try {
    console.log('📝 Changelog changes detected, starting sync...');
    
    // 异步执行同步
    syncToGitBook().catch(error => {
      console.error('❌ Sync failed:', error);
      // 发送通知到 Slack/Discord/Email
      notifyError(error);
    });

    res.status(200).json({ 
      message: 'Changelog sync initiated',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Webhook processing failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 同步到 GitBook
async function syncToGitBook() {
  const gitbook = new GitBookSync(
    process.env.GITBOOK_API_TOKEN,
    process.env.GITBOOK_SPACE_ID
  );

  // 执行同步逻辑
  await gitbook.syncChangelog();
  
  console.log('✅ Changelog sync completed');
  
  // 发送成功通知
  await notifySuccess();
}

// 错误通知
async function notifyError(error) {
  // Slack 通知示例
  if (process.env.SLACK_WEBHOOK_URL) {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `❌ GitBook sync failed: ${error.message}`,
        channel: '#dev-notifications'
      })
    });
  }
}

// 成功通知
async function notifySuccess() {
  if (process.env.SLACK_WEBHOOK_URL) {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `✅ GitBook changelog sync completed successfully`,
        channel: '#dev-notifications'
      })
    });
  }
}

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Webhook server running on port ${PORT}`);
});