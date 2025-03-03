import { motion } from 'framer-motion';

export default function Button({children, textOnly, className, ...props }){
    let cssClass = textOnly ? 'text-button' : 'button';
    cssClass += " " +  className;

    return <motion.button 
    className={cssClass} 
    {...props}
    whileHover={{ scale: 1.1, rotate: 10 }}
    whileTap={{ scale: 0.9 }}
    transition={{ type: 'spring', stiffness: 300 }}
     style={{
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}>           
        {children}
    </motion.button>
}
