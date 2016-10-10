var CfnLambda = require('cfn-lambda');
var AWS = require('aws-sdk');

var Uploader = require('./lib/password');

function PasswordGeneratorHandler(event, context) {
  var PasswordGenerator = CfnLambda({
    Create: Uploader.Create,
    Update: Uploader.Update,
    Delete: Uploader.Delete,
    SchemaPath: [__dirname, 'src', 'schema.json']
  });
  // Not sure if there's a better way to do this...
  AWS.config.region = currentRegion(context);

  return PasswordGenerator(event, context);
}

function currentRegion(context) {
  return context.invokedFunctionArn.match(/^arn:aws:lambda:(\w+-\w+-\d+):/)[1];
}

exports.handler = PasswordGeneratorHandler;
