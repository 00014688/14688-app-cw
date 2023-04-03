const express = require('express')
const app = express()

const fs = require('fs')

app.set('view engine', 'pug')

app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false }))

app.get ('/', (req, res) => {
    res.render('home')
})

app.get('/create', (req, res) => {
    res.render('create')
})

app.post('/create', (req, res) => {
    const title = req.body.title
    const description = req.body.description

    if (title.trim() === '' || description.trim() === '') {
       res.render('create', { error: true, msg: 'Error! You should fill the form.'}) 
    } else {
        fs.readFile('./data/notes.json', (err,data) => {
            if(err) throw err

            const notes = JSON.parse(data)

            notes.push({
                id: id (),
                title: title,
                description: description,
                archiveee: false,
            })

            fs.writeFile('./data/notes.json', JSON.stringify(notes), err => {
               if (err) throw err 

               res.render ('create', { success: true })
            })
        })
    }

  
})


app.get('/api/v1/notes', (req, res) => {
    fs.readFile('./data/notes.json', (err, data) => {
        if (err) throw err 

        const notes = JSON.parse(data)

        res.json(notes)
    }) 
})

app.get('/notes', (req,res) => {

    fs.readFile('./data/notes.json', (err, data) => {
        if (err) throw err 

        const notes = JSON.parse(data)
        const filteredNotes = notes.filter(note => note.archiveee == false)

        res.render('notes', { notes: filteredNotes })
    })
}) 

app.get('/archive', (req,res) => {

    fs.readFile('./data/notes.json', (err, data) => {
        if (err) throw err 

        const notes = JSON.parse(data)
        const filteredNotes = notes.filter(note => note.archiveee == true)

        res.render('archive', { notes: filteredNotes })
    })
}) 





app.get('/notes/:id', (req,res) => {
    const id = req.params.id

    fs.readFile('./data/notes.json', (err, data) => {
        if (err) throw err 

        const notes = JSON.parse(data)

        const note = notes.filter(note => note.id == id)[0]

        res.render('detail', { note: note })

    })
    
})

app.get('/notes/:id/delete', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/notes.json', (err,data) => {
        if (err) throw err 

        const notes = JSON.parse(data)

        const filteredNotes = notes.filter(note => note.id != id) 

        fs.writeFile('./data/notes.json', JSON.stringify(filteredNotes),(err) => {
          if (err)  throw err

          res.render('notes', { notes: filteredNotes, deleted: true }) 
        })
    })
})


// app.get('/:id/update', (req, res) => {
//   const id = req.params.id

//   fs.readFile('./data/notes.json', (err,data) => {
//     if (err) throw err
//   })


//     const notes = JSON.parse(data)
//     const note = notes.filter(note => note.id == req.params.id)[0]
//     const noteIdx = notes.indexOf(note)
//     const splicedNote = notes.splice(noteIdx, 1)[0]
//     splicedNote.done = true
//     notes.push(splicedNote)

//     fs.writeFile('./data/notes.json', JSON.stringify(notes), (err) => {
//         res.render('home', { notes: notes })
//     })
// })

app.get('/notes/:id/archive', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/notes.json', (error, data) => {
        if (error) throw error

        const notes = JSON.parse(data)
        const note = notes.find(note => note.id == id)

        let idx = notes.indexOf(note)

        notes[idx].archiveee = true 

        fs.writeFile('./data/notes.json', JSON.stringify(notes), (error) => {
            if (error) throw error
            res.redirect('/notes')   
        })
    })
})


app.get('/notes/:id/unarchive', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/notes.json', (error, data) => {
        if (error) throw error

        const notes = JSON.parse(data)
        const note = notes.find(note => note.id == id)

        let idx = notes.indexOf(note)

        notes[idx].archiveee = false

        fs.writeFile('./data/notes.json', JSON.stringify(notes), (error) => {
            if (error) throw error
            res.redirect('/archive')
        })
    })
})


app.listen (8000, err => {

    if (err) console.log(err)
    console.log('Server is running on port 8000...')
})



function id () {
    return '_' + Math.random().toString(36).substr(2,9);
}