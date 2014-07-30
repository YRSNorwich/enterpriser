
/*
 * GET home page.
 */

exports.index = function(req, res){
      res.render('index', { title: 'This is the title variable' })
};
