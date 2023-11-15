import './App.css';
import Footer from './Footer';
import ClassCard from './components/ClassCard';

function App() {
  return (
    <div className="App">
      <header className="App-header">Header</header>
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
