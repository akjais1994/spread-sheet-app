import './App.css';
import Table from './components/Table';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <strong>Google Spreadsheet Clone</strong>
      </header>
      <div className="table-container">
        <Table x={10} y={5} />
      </div>
    </div>
  );
}

export default App;
