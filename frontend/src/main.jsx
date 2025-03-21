import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import './styles/toast-styles.css'; // Your custom toast styles
import './styles/custom.css'; // Add this line
import { setupEmptyParagraphRemover } from './utils/htmlProcessor';
import './styles/paragraphFix.css';

// Initialize the empty paragraph remover
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    setupEmptyParagraphRemover();
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
    
  
)
