#!/usr/bin/env bash
set -e

# 登陆输入自己的npm账号和密码，还有邮箱
echo '登录npm'
npm login

echo "发布中..."
npm publish

echo -e "\n发布成功\n"
exit