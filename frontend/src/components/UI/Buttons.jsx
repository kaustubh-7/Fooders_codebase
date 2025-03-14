import { motion } from 'framer-motion';

export default function Button({children, textOnly, className, isCart, ...props }){
    let cssClass = textOnly ? 'text-button' : 'button';
    cssClass += " " +  className;

    const effectHover = isCart ? { color: '#FFFF00' } : { rotate: 3, backgroundColor: '#FFFF00' };
    const effectTap = isCart ? {} : {backgroundColor: '#ffc404' }

    return <motion.button 
    className={cssClass} 
    {...props}
    whileHover={{ scale: 1.08,...effectHover , boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',  }}
    whileTap={{ scale: 0.8, ...effectTap}}
    transition={{ type: 'spring', stiffness: 200 }}
    >
        {children}
    </motion.button>
}