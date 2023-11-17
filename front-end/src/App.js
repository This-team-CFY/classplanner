import './App.css';
import Footer from './Footer';
import ClassCard from './components/ClassCard';
import Toolbar from './components/Toolbar';

function App() {
  return (
    <div className="App">
      <header className="App-header">Header</header>
      <Toolbar />
      <ClassCard />
      <ClassCard />
      <ClassCard />
      <ClassCard />
      <ClassCard />
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
