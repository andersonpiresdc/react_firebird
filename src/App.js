//Bibliotecas
import React, { useState, useEffect } from "react";
import firebase from './firebaseConnection';

//Styles
import './style.css';

//Componentes
import Titulo from './components/Titulo';



function App() {
   const [idPost, setIdPost] = useState('');
   const [titulo, setTitulo] = useState('');
   const [autor, setAutor] = useState('');
   const [posts, setPosts] = useState([]);
   const [email, setEmail] = useState('');
   const [senha, setSenha] = useState('');
   const [user, setUser] = useState(false);
   const [userLogged, setUserLogged] = useState({});


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

   // Fica verificando se tem algum usuário logado.
   useEffect(() => {
      async function checkLogin(){
         await firebase.auth().onAuthStateChanged((user) => {
            if(user){
               setUser(true);
               setUserLogged({
                  uid: user.uid,
                  email: user.email
               })
               console.log(user.uid);
            }else{
               setUser(false);
               setUserLogged({});
            }
         })
      }

      checkLogin();
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



   async function salvarPost(idPost){
      if (idPost === ''){
         handleAdd();
      }else{
         await firebase.firestore().collection('posts')
         .doc(idPost)
         .get()
         .then(() => {
            editarPost()
         })
         .then(() => {
            setIdPost('');
            setTitulo('');
            setAutor('');
         })
         .catch((error) => {alert("Erro ao efetuar a edição do post! "+error)})
      }
   }


   async function buscarPost(){

      if (idPost === ''){
         alert('Não foi informado nenhum código no campo "id".');
         return;
      }

       await firebase.firestore().collection('posts')
       .doc(idPost)
       .get()
       .then((snapshot)=>{
          setTitulo(snapshot.data().titulo);
          setAutor(snapshot.data().autor);
       })
       .catch((error) => {
          console.log("Deu algum erro! "+error);
       })
   }

   async function editarPost(){
      await firebase.firestore().collection('posts')
      .doc(idPost)
      .update({
         titulo: titulo,
         autor: autor
      })
      .then(() => {
         setIdPost('');
         setTitulo('');
         setAutor('');
      })
      .catch((error) => {alert("Erro ao efetuar a edição do post! "+error)})
   }

   // async function excluirPost(){
   //    await firebase.firestore().collection('posts')
   //    .doc(idPost)
   //    .delete()
   //    .then(() => {
   //       setIdPost('');
   //       setTitulo('');
   //       setAutor('');
   //       alert("Excluido com sucesso!");
   //    })
   //    .catch((error) => {
   //       alert("Erro ao tentar excluir o post! "+error);
   //    })
   // }

   async function excluirItem(id){
      await firebase.firestore().collection('posts')
      .doc(id)
      .delete()
      .catch((error) => {
         alert("Não pode excluir o item! "+error)
      })
   }

   async function editItem(id){
      await firebase.firestore().collection('posts')
      .doc(id)
      .get()
      .then((snapshot) => {
         setIdPost(snapshot.id);
         setTitulo(snapshot.data().titulo);
         setAutor(snapshot.data().autor);
      })
      .catch((error) => {
         alert('Erro ocorrido ao tentar editar o post: '+id+' Error: '+error);
      })
   }

   async function novoUsuario(){
      await firebase.auth().createUserWithEmailAndPassword(email, senha)
      .then(() => {
         console.log('Cadastro com sucesso!')
         setEmail('');
         setSenha('');
      })
      .catch((error) => {
         alert("Error: "+error)
      })
   }

   async function logout(){
      await firebase.auth().signOut();
   }

   async function fazerLogin(){
      await firebase.auth().signInWithEmailAndPassword(email, senha)
      .then((value) => {
         console.log(value);
         setEmail('');
         setSenha('');
      })
      .catch((error) => {
         console.log('Error: '+error)
      })
   }

   return (


      <div className="container_principal">
         <Titulo titulo1="React" titulo2="Firebase"/>

         <div className="container">
            <h2 className='tituloSessao'>Cadastro de Usuários</h2>
            <div className='container_usuarios'>
               {user && (
                  
                  <div className='container_userLogado'>
                     <strong>Seja bem vindo0! (Você está logado!)</strong>   
                     <span>{userLogged.uid} - {userLogged.email}</span>
                     <br/><br/>
                  </div>
               )}

               <div className='camposUsuarios'>
                  <input placeholder="informe o seu e-mail aqui..." type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
                  <input placeholder="informe a sua senha aqui..." type="password" value={senha} onChange={(e) => setSenha(e.target.value)}/>
               </div>
               <div className='botoesUsuarios'>
                  <button onClick={() => fazerLogin()}>Login</button>
                  <button onClick={() => novoUsuario()}>Cadastrar</button>
                  {/* <button onClick={buscarPost}>Buscar</button> */}
                  <button onClick={logout}>Sair</button>
               </div>
            </div>

            <h2 className='tituloSessao'>Cadastro de Posts</h2>
            <div className='campos'>
               <input placeholder="id" type="text" value={idPost} onChange={(e) => setIdPost(e.target.value)}/>
               <textarea placeholder="Titulo" type="text" value={titulo} onChange={ (e) => setTitulo(e.target.value)}/>
               <textarea placeholder='Autor' type="text" value={autor} onChange={ (e) => setAutor(e.target.value)}/>
            </div>

            <div className='botoes'>
               <button onClick={/*handleAdd*/() => salvarPost(idPost)}>Cadastrar</button><br/>
               <button onClick={buscarPost}>Buscar</button><br/>
               {/* <button onClick={editarPost}>Editar Post</button><br/> */}
               {/* <button onClick={excluirPost}>Excluir Post</button><br/> */}
            </div>


            <div className="container_posts">
               <ul>
                  {posts.map((post)=>{
                     return(
                        <li key={post.id}>
                           <div>
                           <span>
                              <strong className="span_id">
                                 ID: 
                              </strong>
                              {post.id}
                           </span><br/>
                           <span>
                              <strong className="span_id">
                              Titulo: 
                              </strong>
                              {post.titulo}
                           </span><br/>
                           <span>
                              <strong className="span_id">
                              Autor: 
                              </strong>
                              {post.autor}
                           </span><br/>
                           </div>
                           <div>
                              <ion-icon name="create-outline" onClick={() => editItem(post.id)}></ion-icon>
                              <ion-icon name="trash-outline" onClick={() => excluirItem(post.id)}></ion-icon>
                           </div>
                        </li>
                     )
                  })}
               </ul>
            </div>
         </div>
      </div>
   );
}

export default App;
