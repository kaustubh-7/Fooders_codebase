import { motion } from 'framer-motion';

export default function Button({children, textOnly, className, ...props }){
    let cssClass = textOnly ? 'text-button' : 'button';
    cssClass += " " +  className;

    return <motion.button 
    className={cssClass} 
    {...props}
    whileHover={{ scale: 1.1, rotate: 10 }}
    whileTap={{ scale: 0.9 }}
    transition={{ type: 'spring', stiffness: 300 }}>
        {children}
    </motion.button>
}
