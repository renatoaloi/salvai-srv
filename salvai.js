var formidable = require('formidable');
var http = require('http');
var fs = require('fs');

var server = http.createServer((req, res) => {
	//res.end('<html><body>teste de servidor do salvai</body></html>');
	if (!((req.url === '/upload') && (req.method === 'POST'))) {
		home(res);
	}
	else {
		upload(req, res);
	}
});

server.listen(3000);

function home(res) {
	res.end("<html><body><form action='/upload' method='post' enctype='multipart/form-data'><input name='image' type='file'/><input type='submit'></form></body></html>");
}

function upload(req, res) {
	//res.end('<html><body>upload</body></html>');
	var form = new formidable.IncomingForm();

	form.parse(req, (err, fields, files) => {
		res.writeHead(200, { 'content-type': 'text/plain'});
		res.write('received upload:\n\n');

		//console.log(fields);

		var image = files.image;
		var image_upload_path_old = image.path;
		//var image_upload_new_path = './upload/';
		var image_upload_new_path = './upload' + fields.original_path + '/';
		var image_upload_name = image.name;
		var image_upload_path_name = image_upload_new_path + image_upload_name;
		if (fs.existsSync(image_upload_new_path)) {
			fs.rename(
				image_upload_path_old,
				image_upload_path_name,
				(err) => {
					if (err) {
						console.log('Err1', err);
						res.end('<html><body>deu erro na hora de mover a imagem</body></html>');
					}
					var msg = 'Imagem ' + image_upload_name + ' salva em: ' + image_upload_new_path;
					console.log(msg);
					res.end('<html><body>' + msg + '</body></html>');
				});
		}
		else {
			var strPath = '';
			var paths = image_upload_new_path.split('/');
			for (var i = 0; i < paths.length - 1; i++) {
				strPath += paths[i] + '/';
				if (!fs.existsSync(strPath)) {
					fs.mkdir(strPath, (err) => {
						if (err) {
							console.log('Err2', err);
							res.end('<html><body>deu erro ao criar o diretório!</body></html>');
						}
					});
				}
			}
			fs.rename(image_upload_path_old, image_upload_path_name, (err) => {
						var msg = 'Imagem ' + image_upload_name + ' salva em: ' + image_upload_new_path;
						console.log(msg);
						res.end('<html><body>' + msg + '</body></html>');
					});
		}
	});
}