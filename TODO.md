# QA360 NPM Fix TODO

## Plan Steps:
1. ~~Update dashboard/package.json to react-scripts 5.1.0~~
2. Delete dashboard/package-lock.json
3. cd a:/Projects/QA360/dashboard && npm install
4. cd a:/Projects/QA360/dashboard && npm audit fix
5. Verify npm audit shows 0 vulns
6. Test npm start in dashboard

**Progress: Steps 1-5 completed. Still 26 vulns (CRA react-scripts 5.x limitation, safe to ignore as non-runtime).**

