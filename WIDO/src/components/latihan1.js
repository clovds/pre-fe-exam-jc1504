import Axios from 'axios'
import { Button } from 'reactstrap'
import React from 'react'
import { api_url } from '../helpers/api_url'


class Home extends React.Component{
    state = {
        data: {
            nama: '',
            usia: '',
            pekerjaan: ''},
        dbData: [],
        categoryList: [],
        selectedJob: '',
        idEdit: '',
    }

    componentDidMount() {
        this.fetchData()
        this.fetchCategory()
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.selectedJob !== this.state.selectedJob){
            const { selectedJob } = this.state
            if(selectedJob === 'All') {
                this.fetchData()
            } else {
                this.fetchDataByPekerjaan()
            }
        }

    }

    onChangeInput = (e) => {
        this.setState({
            data: {
            ...this.state.data,
            [e.target.id]: e.target.value
            }
        })
        console.log(this.state.data)
    }

    addToData = () => {
        let data = this.state.data
        Axios.post(`${api_url}/users`, data)
        .then((res) => {
            console.log('data added')
            this.fetchData()
            this.addToCategory()
        })
        .catch((err) => {
            console.log(err)
        })
    }

    fetchData = () => {
        Axios.get(`${api_url}/users`)
        .then((res) => {
            console.log(res.data)
            this.setState({
                dbData: res.data,
            })
        })
        .catch((err) => {
            console.log(err);
        })
    }

    fetchCategory = () => {
        Axios.get(`${api_url}/pekerjaan`)
        .then((res) => {
            console.log(res);
            this.setState({
                categoryList: res.data
            })
        }).catch((err) => {
            console.log(err);
        });
    }

    addToCategory = () => {
        const { pekerjaan } = this.state.data
        Axios.get(`${api_url}/pekerjaan?pekerjaan=${pekerjaan}`)
        .then((res) => {
            if(res.data.length === 0) {
                Axios.post(`${api_url}/pekerjaan`, {
                    pekerjaan
                })
                .then((res) => {
                    this.fetchCategory()
                }).catch((err) => {
                  console.log(err);  
                });
            }
        }).catch((err) => {
            
        });
        
    }

    deleteCategory = (pekerjaan) => {
        Axios.get(`${api_url}/users?pekerjaan=${pekerjaan}`)
        .then((res) => {
            console.log(res.data)
            if(res.data.length === 0) {
                Axios.get(`${api_url}/pekerjaan`)
                .then((result) => {
                    let newArr = result.data.find((val) => {
                        return val.pekerjaan === pekerjaan
                    })
                    console.log(newArr.data)
                    Axios.delete(`${api_url}/pekerjaan/${newArr.id}`)
                    .then((res) => {
                        console.log(newArr.data)
                        console.log('ctg dlt')
                        this.fetchCategory()
                    }).catch((err) => {
                        console.log(err)
                    });
                }).catch((err) => {
                    console.log(err)
                });
            }
        }).catch((err) => {
            
        });
    }

    renderData = (id) => {
        console.log(id)
        let newArr = this.state.dbData.map((val, index) => {
            if(index === id) {
                return (
                <tr>
                    <td><input type="text" className='form-control' placeholder='Nama' id='nama' onChange={this.onChangeInput}/></td>
                    <td><input type="text" className='form-control' placeholder='Usia' id='usia' onChange={this.onChangeInput}/></td>
                    <td><input type="text" className='form-control' placeholder='Pekerjaan' id='pekerjaan' onChange={this.onChangeInput}/></td>
                    <td><Button onClick={() => {this.updateBtn(val.id, val.pekerjaan)}}>Update</Button></td>
                    <td><Button onClick={this.cancelbtn}>Cancel</Button></td>
                </tr>
                )
            } else {
            return (
                <tr>
                    <td>{val.nama}</td>
                    <td>{val.usia}</td>
                    <td>{val.pekerjaan}</td>
                    <td><Button color='warning' onClick={() => this.editBtn(index)}>Edit</Button></td>
                    <td><Button color='danger' onClick={() => this.deleteByPekerjaan(val.id, val.pekerjaan)}>Delete</Button></td>
                </tr>
            )
            }
        })
        return newArr
    }

    editBtn = (id) => {
        console.log('editdata', id);
        this.setState({
            idEdit: id
        })
    }

    cancelbtn = () => {
        this.setState({
            idEdit: ''
        })
    }

    // updateBtn = (id, pekerjaan) => {
    //     const { data } = this.state
    //     Axios.patch
    // }
    updateBtn = (id, pekerjaan) => {
        const {data} = this.state
        console.log(id);
        console.log(pekerjaan);
        console.log(data);
        Axios.patch(`${api_url}/users/${id}`, data)
        .then((res) => {
            this.setState({idEdit: ''})
            this.fetchData()
            Axios.get(`${api_url}/users?pekerjaan=${pekerjaan}`)
            .then((res) => {
                if(res.data.length === 0) {
                    Axios.get(`${api_url}/pekerjaan`)
                    .then((res) => {
                        let resTemp = res.data.find((val) => {
                            return val.pekerjaan === pekerjaan
                        })
                        Axios.delete(`${api_url}/pekerjaan/${resTemp.id}`)
                        .then((res) => {
                            this.fetchCategory()
                        }).catch((err) => {});
                    }).catch((err) => {});
                }
            }).catch((err) => {})

            Axios.get(`${api_url}/pekerjaan?pekerjaan=${data.pekerjaan}`)
                    .then((res) => {
                        if (res.data.length === 0) {
                            Axios.post(`${api_url}/pekerjaan`, {
                                pekerjaan: data.pekerjaan
                            })
                            .then((res) => {
                                this.fetchCategory()
                            }).catch((err) => {
                                
                            });
                        }
                    }).catch((err) => {});
        }).catch((err) => {
            console.log(err);
        });
    }

    renderCategoryList = () => {
        let newArr = this.state.categoryList.map((val) => {
            return <option>{val.pekerjaan}</option>
        })
        return (
            <select className='form-control' onChange={this.onChangeJob}>
                <option selected disabled>Filter By Pekerjaan</option>
                <option>All</option>
                {newArr}
            </select>
        )
    }

    fetchDataByPekerjaan = () => {
        const { selectedJob } = this.state
        Axios.get(`${api_url}/users?pekerjaan=${selectedJob}`)
        .then((res) => {
            this.setState({
                dbData: res.data
            })
        })
        .catch((err) => {
            console.log(err);
        })
    }

    onChangeJob = (e) => {
        this.setState({
            selectedJob: e.target.value
        })
    }

    deleteByPekerjaan = (id, pekerjaan) => {
            Axios.delete(`${api_url}/users/${id}`, {
            })
            .then((res) => {
                console.log('deleted');
                this.fetchData()
                this.deleteCategory(pekerjaan)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    deleteAll = () => {
        const { dbData, categoryList } = this.state
        for (let i = 0; i < dbData.length; i++) {
            Axios.delete(`${api_url}/users/${[dbData[i].id]}`)
            .then((res) => {
                console.log('deleted');
                this.fetchData()
                for (let j = 0; j < categoryList.length; j++) {
                    Axios.delete(`${api_url}/pekerjaan/${categoryList[j].id}`)
                    .then((res) => {
                        console.log('deleted category');
                        this.fetchCategory()
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }

    editData = (id) => {
        Axios.patch(`${api_url}/users/${id}`, {
        })
    }

    render(){
        const id = this.state.idEdit
        return(
            <div>
                <h1>SOAL 1</h1>
                <div className='row'>
                    <div className='col-md-4 mb-4'>
                        {this.renderCategoryList()}
                    </div>
                    <div><Button color='danger' onClick={this.deleteAll}>Delete All</Button></div>
                </div>
                <table className='table mb-4'>
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Usia</th>
                            <th>Pekerjaan</th>
                            <th colSpan='2'>Act</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.renderData(id)}
                    </tbody>
                </table>
                <div className='row mb-5'>
                    <div className='col-md-3'> <input type='text' className='form-control' placeholder='Nama' id='nama' onChange={this.onChangeInput} /> </div>
                    <div className='col-md-3'> <input type='text' className='form-control' placeholder='Usia' id='usia' onChange={this.onChangeInput} /> </div>
                    <div className='col-md-3'> <input type='text' className='form-control' placeholder='Pekerjaan' id='pekerjaan' onChange={this.onChangeInput} /> </div>
                    <div className='col-md-3'> <input type='button' className='form-control btn-info' value='add Data' onClick={this.addToData} /> </div>
                </div>
            </div>
        )
    }
}

export default Home