import { motion } from 'framer-motion';

export default function Button({children, textOnly, className, ...props }){
    let cssClass = textOnly ? 'text-button' : 'button';
    cssClass += " " +  className;

    return <motion.button 
    className={cssClass} 
    {...props}
    whileHover={{ scale: 1.08, rotate: 3, backgroundColor: 'yellow', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',  }}
    whileTap={{ scale: 0.999, backgroundColor: '#ffc404' }}
    transition={{ type: 'spring', stiffness: 200 }}
    >
        {children}
    </motion.button>
}
