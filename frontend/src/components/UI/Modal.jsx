import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({ children, open, onClose, className='' }) {
    const dialog = useRef();
    useEffect(()=>{
        const modal = dialog.current;//Directly accessing dialog.current within every render or effect could lead to unnecessary DOM access and checks. By storing the modal reference (dialog.current) in a constant (modal), you minimize repeated lookups, making the code more efficient.
// Using a variable (modal) ensures that the same instance of the modal is used consistently for both showing and closing it. This consistency is crucial for cleanup in the return function of useEffect.
// Although the performance gain might be negligible in small applications, in larger applications with more complex logic, reducing the frequency of DOM interactions can contribute to better performance.
        if(open){
            modal.showModal();
        }

        return () => modal.close();
    }, [open])


    return createPortal(<dialog ref={dialog} className={`modal ${className}`} onClose={onClose}>{children}</dialog>
        , document.getElementById('modal'));
}