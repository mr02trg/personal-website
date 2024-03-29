
var express = require('express');

const MAX_UPLOADS = 10;
const multerStorage = require('../multer/multer-helper');

var router = express.Router();

const securityHandler = require('../middleware/security-handler');
const postService =  require('../service/postService');

router.get('', securityHandler, postService.getPosts);

router.get('/:id', securityHandler, postService.getPostById);

router.post('', securityHandler, multerStorage.array("documents", MAX_UPLOADS), postService.addPost);

router.put('/:id', securityHandler, multerStorage.array("documents", MAX_UPLOADS), postService.updatePost);

router.delete('/:id', securityHandler, postService.deletePost);

router.post('/:id/document', securityHandler, postService.downloadPostDocument);

router.post('/:id/publish', securityHandler, postService.publishPost);

router.post('/:id/unpublish', securityHandler, postService.unPublishPost);

module.exports = router;