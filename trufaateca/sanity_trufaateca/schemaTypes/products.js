export default {
    name : 'products',
    title: 'Productos',
    type: 'document',
    fields: [
        {
            name: 'image',
            title: 'Imagen',
            type: 'array',
            of : [{type: 'image'}],
            options: {
                hotspot : true
            }
        },
        {
            name: 'name',
            title: 'Nombre',
            type: 'string'
        },
        {
            name: 'slug',
            title: 'Identificador',
            type: 'slug',
            options:{
                source: 'name',
                maxLength:90,
            }
        },
        {
            name: 'price',
            title: 'Precio',
            type:'number'
        },
        {
            name: 'details',
            title: 'Detalles',
            type: 'string'
        },
        {
            name: 'temporada',
            title: 'Temporada',
            type: 'string'
        },
        {
            name: 'stock',
            title: 'Stock',
            type: 'string'
        }
    ]
}