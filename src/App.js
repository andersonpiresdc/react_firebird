import firebase from './firebaseConnection';
import { useState, useEffect } from 'react';
import './style.css';

function App() {
   const [id, setIdPost] = useState('');
   const [titulo, setTitulo] = useState('');
   const [autor, setAutor] = useState('');
   const [posts, setPosts] = useState([]);
//   const [dadosCampos, setDadosCampos] = useState({id, titulo, autor});

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
       await firebase.firestore().collection('posts')
       .doc(id)
       .get()
       .then((snapshot)=>{
          setTitulo(snapshot.data().titulo);
          setAutor(snapshot.data().autor);
       })
       .catch((error) => {
          console.log("Deu algum erro!");
       })
/*      await firebase.firestore().collection('posts')
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
      })*/
   }

   async function editarPost(){
      await firebase.firestore().collection('posts')
      .doc(id)
      .update({
         titulo: titulo,
         autor: autor
      })
      .then(() => {
         setIdPost('');
         setTitulo('');
         setAutor('');
      })
      .catch(() => {alert("Erro ao efetuar a edição do post!")})
   }

   async function excluirPost(){
      await firebase.firestore().collection('posts')
      .doc(id)
      .delete()
      .then(() => {
         setIdPost('');
         setTitulo('');
         setAutor('');
         alert("Excluido com sucesso!");
      })
      .catch(() => {
         alert("Erro ao tentar excluir o post!");
      })
   }

   return (
      <div className="container">
         <h1>ReactJS + Firebase</h1><br/>
         <label>Id:</label>
         <input type="text" value={id} onChange={(e) => setIdPost(e.target.value)}/>
         <label>Titulo:</label>
         <textarea type="text" value={titulo} onChange={ (e) => setTitulo(e.target.value)}/>
         <label>Autor:</label>
         <textarea type="text" value={autor} onChange={ (e) => setAutor(e.target.value)}/>
         <button onClick={handleAdd}>Cadastrar</button><br/>
         <button onClick={buscarPost}>Buscar Post</button><br/>
         <button onClick={editarPost}>Editar Post</button><br/>
         <button onClick={excluirPost}>Excluir Post</button><br/>

         <ul>
            {posts.map((post)=>{
               return(
                  <li key={post.id}>
                     <span>id: {post.id}</span><br/>
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
