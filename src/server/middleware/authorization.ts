exports.requiresLogin = (req: any, res: any, next: any) => {
  if (req.method == 'GET') {
    req.session.returnTo = req.originalUrl;
  }

  if (!req.session.user || typeof req.session.user === 'undefined') {
    res.redirect('/login')
  } else {
    next()
  }
}
