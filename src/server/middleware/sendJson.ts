export = function sendJson(res: any, err: any, data: any) {
  if (err || !data) {
    res.status(404).json({ message: 'No records could be found' });
  } else {
    // console.log(data)
    res.status(200).json(data);
  }
}
