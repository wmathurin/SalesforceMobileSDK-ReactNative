module.exports = {
  dependency: {
    platforms: {
      android: {
        packageImportPath: 'import com.salesforce.androidsdk.reactnative.app.SalesforceReactPackage;',
        packageInstance: 'new SalesforceReactPackage()',
      },
      ios: null,
    },
  },
};
