import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { withApollo } from 'react-apollo';
import { GET_ALL_JOBS_FN } from './constants/constants';
import TableComponent from './components/shared/table';
import Filter from './utils/filter';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        country: '',
        company: '',
        name: ''
      },
      allJobs: [],
      allJobsFilteredByName: [],
      allCountriesLoaded: [],
      allCompaniesLoaded: []
    }
  }

  componentDidMount() {
    this.runQueryGetJobs().then(res => {
      console.log(res)
      this.setState({ allJobs: res.data.jobs },
        this.loadCountriesCombo(res.data.jobs),
        this.loadCompaniesCombo(res.data.jobs)
        );
    })
  }

  componentDidUpdate() {
    if (this.state.options.name === "" && this.state.allJobsFilteredByName.length > 0) {
        this.setState({ allJobsFilteredByName: [] })
    }
  }

  loadCountriesCombo = (allJobs) => {
    let result = [];
    if (allJobs) {
      allJobs.forEach(job => {
        if (job.countries && job.countries.length > 0) {
          job.countries.forEach(country => { if(result) result.push(country) })
        }   
      })
    }
    console.log(result)
    this.setState({ allCountriesLoaded: result })
  }

  loadCompaniesCombo = (allJobs) => {
    let result = [];
    if (allJobs) {
      allJobs.forEach(job => {
        if (job.company && job.company.name) {
          result.push(job.company)
        }   
      })
    }
    console.log(result)
    this.setState({ allCompaniesLoaded: result })
  }

  filterRows = (evt) => {
    const { options } = this.state;
    const value = evt.target.value
    const id = evt.target.id
    const aux = { ...options };
    console.log(value)
    console.log(id)
    console.log(options)
    if (!value && id) {
      aux.name = '';
      this.setState({ options: aux });
    }
    else {
      if (value && id) {
  
        aux[id] = value;
        this.setState({ options: aux });
      }
    }
  }

  searchJob = (e) => {
    const { options, allJobs } = this.state;
    let resultFiltered = [];
    // if (e) {
      if (e) e.preventDefault()
      if(options && options.name && allJobs) {
        console.log(options.name)
        resultFiltered = Filter.filterByName(options.name, allJobs)
        console.log(resultFiltered)
        this.setState({ allJobsFilteredByName: resultFiltered });
      }
  }

  runQueryGetJobs = () => {
    const a = this.props.client.query({
      query: GET_ALL_JOBS_FN,
      variables: {}
    })
    return a;
  }
  
  render() {
    const { options, allCompaniesLoaded, allCountriesLoaded, allJobsFilteredByName } = this.state;
    console.log(allJobsFilteredByName)
    return (
      <div className="App container-fluid">
        <form>
          <div className="form-row align-items-center">
            <div className="col-4 my-1">
              <label className="sr-only" for="inlineFormInputGroupUsername">Username</label>
              <div className="input-group">
                <input type="text" className="form-control" value={options.name} id="name" onChange={this.filterRows.bind(this)} placeholder="Ingresa el nombre del empleo..." />
              </div>
            </div>
            <div className="col-2 my-1">
              <button onClick={this.searchJob} className="btn btn-primary">Buscar</button>
            </div>
            <div className="col-3 my-1">
              <select class="custom-select" value={options.country} id="country" onChange={this.filterRows.bind(this)}>
                <option selected disabled value="">Seleeciona País</option>
                {
                  (allCountriesLoaded && allCountriesLoaded.length) &&
                  allCountriesLoaded.map(job => <option selected value={job.name}>{job.name}</option>)
                }
                {/* 
                <option>...</option> */}
              </select>
            </div>
            <div className="col-3 my-1">
              <select class="custom-select" value={options.company} id="company" onChange={this.filterRows.bind(this)}>
              <option selected disabled value="">Seleeciona Compañia</option>
              {
                  (allCompaniesLoaded && allCompaniesLoaded.length) &&
                  allCompaniesLoaded.map(job => <option selected value={job.name}>{job.name}</option>)
                }
              </select>
            </div>
          </div>
        </form>
        <TableComponent elements={(allJobsFilteredByName && allJobsFilteredByName.length > 0) ? allJobsFilteredByName : this.state.allJobs} />
      </div>
    );
  }
}

export default withApollo(App);
