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
      this.setState({ allJobs: res.data.jobs, allJobsFilteredByName: res.data.jobs },
        this.loadCountriesCombo(res.data.jobs),
        this.loadCompaniesCombo(res.data.jobs)
        );
    })
  }
  loadJobjs = () => {
    this.runQueryGetJobs().then(res => {
      console.log(res)
      this.setState({ allJobs: res.data.jobs, allJobsFilteredByName: res.data.jobs },
        this.loadCountriesCombo(res.data.jobs),
        this.loadCompaniesCombo(res.data.jobs)
        );
    })
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
    const withOutDuplicate = this.find_duplicate_in_array(result);
    this.setState({ allCountriesLoaded: withOutDuplicate })
  }

  find_duplicate_in_array = (arra1) => {
    let result = [];
    let objTitle
    // Declare a new array 
          
    // Declare an empty object 
    let uniqueObject = {}; 
    for (let i in arra1) { 
      
      // Extract the title 
      objTitle = arra1[i]['name']; 

      // Use the title as the index 
      uniqueObject[objTitle] = arra1[i]; 
  } 
    
  // Loop to push unique object into array 
  for (let i in uniqueObject) { 
      result.push(uniqueObject[i]); 
  } 

    return result;

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
    const withOutDuplicate = this.find_duplicate_in_array(result);
    console.log(withOutDuplicate)
    this.setState({ allCompaniesLoaded: withOutDuplicate })
  }

  filterRows = (evt) => {
    const { options, allJobs, allJobsFilteredByName } = this.state;
    let result = []
    const value = evt.target.value
    const id = evt.target.id
    const aux = { ...options };
    if (id === "country") {
      let auxJobs = [ ...this.state.allJobs ]
      if (allJobsFilteredByName.length !== allJobs.length) {
        allJobsFilteredByName.forEach(job => {
          if (job.countries.length && job.countries[0] && job.countries[0].name === value) {
            result.push(job)
            job = {}
          }
          return result;
        })
        console.log(result)
        this.setState({ allJobsFilteredByName: result});
      }
      if (allJobsFilteredByName.length === allJobs.length) {
        auxJobs.forEach(job => {
          if (job.countries.length && job.countries[0] && job.countries[0].name === value) {
            result.push(job)
            job = {}
          }
          return result;
        })
        console.log(result)
        this.setState({ allJobsFilteredByName: result});
      }
    } else if (id === "company") {
      let auxJobs = [ ...this.state.allJobs ]
      // if (allJobs.length) {
      //   auxJobs.forEach(job => {
      //     if (job.company && job.company.name === value) {
      //       result.push(job)
      //       job = {}
      //     }
      //     return result;
      //   })
      //   this.setState({ allJobsFilteredByName: result});
      // }
      if (allJobsFilteredByName.length !== allJobs.length) {
        allJobsFilteredByName.forEach(job => {
          if (job.company && job.company.name === value) {
            result.push(job)
            job = {}
          }
          return result;
        })
        console.log(result)
        this.setState({ allJobsFilteredByName: result});
      }
      if (allJobsFilteredByName.length === allJobs.length) {
        auxJobs.forEach(job => {
          if (job.company && job.company.name === value) {
            result.push(job)
            job = {}
          }
          return result;
        })
        console.log(result)
        this.setState({ allJobsFilteredByName: result});
      }
    }
    else {
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
  }

  searchJob = (e) => {
    const { options, allJobs } = this.state;
    let resultFiltered = [];
      if (e) e.preventDefault()
      if(options && options.name && allJobs) {
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

  showAll = () => this.loadJobjs();
  
  render() {
    const { options, allCompaniesLoaded, allCountriesLoaded, allJobsFilteredByName } = this.state;
    console.log(options)
    return (
      <div className="App container-fluid">
            <div className="row">
              <div className="col-6 mLft20 my-1">
                <label className="sr-only" for="inlineFormInputGroupUsername">Username</label>
                <div className="input-group">
                  <input type="text" className="form-control" value={options.name} id="name" onChange={this.filterRows.bind(this)} placeholder="Ingresa el nombre del empleo..." />
                </div>
              </div>
              <div className="col-3" style={{'display': 'inline-flex'}}>
                <button onClick={this.searchJob} className="btn btn-primary" disabled={options && options.name.length === 0}>Buscar</button>
                <button onClick={this.showAll} className="btn btn-primary" style={{'marginLeft': '5px'}}>Ver todos</button>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
              (*) La búsqueda por nombre es sobre el total de JOBS por defecto.<br/>
              (*) Los filtros se realizan sobre el listado filtrado siempre que se haya buscado por nombre previamente, caso contrario es sobre el total de JOBS. 
              </div>
            <div className="col-3 mAuto">
                <select class="custom-select" value={options.country} id="country" onChange={this.filterRows.bind(this)}>
                  <option selected disabled value="">{(options && options.country) ? options.country : 'Seleeciona País'}</option>
                  {
                    (allCountriesLoaded && allCountriesLoaded.length) &&
                    allCountriesLoaded.map(job => <option selected value={job.name}>{job.name}</option>)
                  }
                </select>
              </div>
              <div className="col-3 mAuto">
                <select class="custom-select" value={options.company} id="company" onChange={this.filterRows.bind(this)}>
                <option selected disabled value="">{(options && options.countcompanyry) ? options.company : 'Seleeciona Compañía'}</option>
                {
                    (allCompaniesLoaded && allCompaniesLoaded.length) &&
                    allCompaniesLoaded.map(job => <option selected value={job.name}>{job.name}</option>)
                  }
                </select>
              </div>
            </div>
          <TableComponent elements={allJobsFilteredByName} />
        </div>
    );
  }
}

export default withApollo(App);
