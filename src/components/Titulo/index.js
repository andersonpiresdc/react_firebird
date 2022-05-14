import React from 'react';
import './Titulo.css';
import { RiReactjsLine } from 'react-icons/ri';
import { SiFirebase } from 'react-icons/si';

function Titulo(props) {
      return(
         <h1><RiReactjsLine className="logoReact"/>{props.titulo1}<SiFirebase className='logoFirebase'/>{props.titulo2}</h1>   
      )
   }

export default Titulo;