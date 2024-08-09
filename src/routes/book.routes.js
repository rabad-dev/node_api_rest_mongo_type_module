import express from 'express';
import Book from '../models/book.model.js';

const router = express.Router();

//Meddleware

const getBook = async (req, res, next) =>{

    let book;
    const { id } = req.params;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(404).json({massage: 'El ID del libro no es valido'});   
    }

    try{
        book = await Book.findById(id);
        if(!book){
            return res.status(404).json({message: 'El libro no fue encontrado'});
        }
    }catch(error){
        return res.status(500).json({message: error.message})

    }

    res.book = book;
    next();

}



//Obtener todos los librosr
router.get('/', async (req, res)=>{
    try{
        const books = await Book.find();
        /// console.log(books, 'cantidad de libros', books.length);


        if(books.length == 0){
            // console.log('entrada al if length = 0');
            return res.status(204).json({message: 'No data found'});
        }
        
        return res.json(books);

    } catch(error){
        res.status(500).json({message: error.message});
    }
});

//Crear un libro (recurso)
router.post('/', async (req, res) => {
    const { title, author, genre, publication_date } = req?.body;

    if (!title || !author || !genre || !publication_date){
        return res.status(400).json({message: 'The fields title, author, genre and publication_date are required'});
    }

    const book = new Book(
        {
            title,
            author,
            genre,
            publication_date
        }
    )
    try{
        const newBook = await book.save();
        res.status(201).json(newBook);

    }catch (error ){
        res.status(400).json({message: error.message});
    }

});

router.get('/:id', getBook, async(req, res) => {
    res.status(201).json(res.book);
});

router.put('/:id', getBook, async(req, res) => {
    try{
        const book = res.book;
        
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;       
        
        const updatedBook = await book.save();
        res.json(updatedBook);

    }
    catch(error){
        res.status(400).json({message: error.message});
    }
});


router.patch('/:id', getBook, async(req, res) => {
    const {title, author, genre, publication_date} = req.body
    
    if(!title && ! author && !genre && !publication_date){
        res.status(400).json({
            message: 'Al menos un campo debe ser enviado: title, author, genre, publication_date'
        });
    }


    try{
        const book = res.book;
        
        book.title = title || book.title;
        book.author = author || book.author;
        book.genre = genre || book.genre;
        book.publication_date = publication_date || book.publication_date;       
        
        const updatedBook = await book.save();
        res.json(updatedBook);

    }
    catch(error){
        res.status(400).json({message: error.message});
    }
});


router.delete('/:id', getBook, async(req, res) => {
    //res.json(res.book);
    try {
        const book = res.book;
        await book.deleteOne({
            _id: book._id
        });

        res.status(202).json({message: `El libro ${book.title} fue eliminado correctamente`});

    } catch (error) {
        res.status(500).json({message: error.message});
        
    }

});



export default router;