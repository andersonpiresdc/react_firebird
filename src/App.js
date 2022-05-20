//Bibliotecas
import React, { useState } from "react";
import firebase from './firebaseConnection';

//Styles
import './reset.css';
import './style.css';

//Componentes
import Titulo from './components/Titulo';



function App() {
   const [email, setEmail] = useState('');
   const [senha, setSenha] = useState('');
   const [cargo, setCargo] = useState('');
   const [nome, setNome] = useState('');


   async function novoUsuario(){
      await firebase.auth().createUserWithEmailAndPassword(email, senha)
      .then(async (value) => {
         
         firebase.firestore().collection('users')
         .doc(value.user.uid)
         .set({
            nome: nome,
            cargo: cargo,
            status: true,
         })
         .then(() => {
            setEmail('');
            setSenha('');
            setCargo('');
            setNome('');
   
         })
         .catch((error) =>{
            console.log('Erro ocorrido ao tentar registrar um novo usuário. Error: '+error)
         })
      })
      .catch((error) => {
         alert("Error: "+error)
      })
   }

   async function logout(){
      await firebase.auth().signOut();
   }

   return (

      <div className="container_principal">
         <Titulo titulo1="React" titulo2="Firebase"/>

         <div className="container">
            <h2 className='tituloSessao'>Cadastro de Usuários</h2>
            <div className='container_usuarios'>
               <div className='camposUsuarios'>
                  <input placeholder="informe o seu e-mail aqui..." type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
                  <input placeholder="informe a sua senha aqui..." type="password" value={senha} onChange={(e) => setSenha(e.target.value)}/>
                  <input placeholder="informe a seu cargo na empresa..." type="text" value={cargo} onChange={(e) => setCargo(e.target.value)}/>
                  <input placeholder="informe a seu nome..." type="text" value={nome} onChange={(e) => setNome(e.target.value)}/>
               </div>

               <div className='botoesUsuarios'>
                  <button onClick={() => novoUsuario()}>Cadastrar</button>
                  <button onClick={logout}>Sair</button>
               </div>
            </div>
         </div>
      </div>

   );
}

export default App;
