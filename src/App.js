import firebase from './firebaseConnection';
import { useState, useEffect } from 'react';
import './style.css';

function App() {
   const [titulo, setTitulo] = useState('');
   const [autor, setAutor] = useState('');
   const [posts, setPosts] = useState([]);

   useEffect(() => {
      async function loadPosts(){
         await firebase.firestore().collection('posts')
         .onSnapshot((doc) =>{
            let meusposts = [];
            doc.forEach((item)=>{
               meusposts.push({
                  id: item.id,
                  titulo: item.data().titulo,
                  autor: item.data().autor
               })
            })
         setPosts(meusposts);
         })
      }

      loadPosts();

   }, []);

   async function handleAdd(){
      await firebase.firestore().collection('posts')
      .add({
         titulo: titulo,
         autor: autor   
      })
      .then(() => {
         console.log('Dados cadastrado com sucesso!');
         setTitulo('');
         setAutor('');
      })
      .catch((error)=>{
         console.log('Gerou algum erro: '+error);
      })
   }

   async function buscarPost(){
      // await firebase.firestore().collection('posts')
      // .doc('1234')
      // .get()
      // .then((snapshot)=>{
      //    setTitulo(snapshot.data().titulo);
      //    setAutor(snapshot.data().autor);
      // })
      // .catch((error) => {
      //    console.log("Deu algum erro!");
      // })
      await firebase.firestore().collection('posts')
      .get()
      .then((snapshot)=>{
         let lista = [];
         snapshot.forEach((doc)=>{
            lista.push({
               id: doc.id,
               titulo: doc.data().titulo,
               autor: doc.data().autor
            })
         setPosts(lista);
         })
      })
      .catch((error)=>{
         console.log("Deu algum erro ao carregar os Posts")
      })
   }

   return (
      <div className="container">
         <h1>ReactJS + Firebase</h1><br/>
         <label>Titulo:</label>
         <textarea type="text" value={titulo} onChange={ (e) => setTitulo(e.target.value)}/>
         <label>Autor:</label>
         <textarea type="text" value={autor} onChange={ (e) => setAutor(e.target.value)}/>
         <button onClick={handleAdd}>Cadastrar</button>
         <button onClick={buscarPost}>Buscar Post</button><br/>

         <ul>
            {posts.map((post)=>{
               return(
                  <li key={post.id}>
                     <span>Titulo: {post.titulo}</span><br/>
                     <span>Autor: {post.autor}</span><br/><br/>
                  </li>
               )
            })}
         </ul>


      </div>
   );
}

export default App;
