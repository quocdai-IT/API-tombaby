module.exports = function(app){
    app.use('/', require('./home'))
    app.use('/api/products', require('./product'))
    app.use('/api/get_samegroup', require('./get_samegroup'))
    app.use('/api/catalogs', require('./catalog'))
}