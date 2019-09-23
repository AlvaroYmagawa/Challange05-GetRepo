import React, { Component } from 'react';
import { FaGitAlt, FaPlus, FaSpinner, FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom'

import api from '../../services/api';

import Container from '../../components/Container';
import { Form, SubmitButton, List, DeleteButton, Error } from './styles'

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    err: false,
  };

  // Load datas in localStorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  // Save datas in localStorage
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  }

  handleSubmit = async e => {

    e.preventDefault();

    this.setState({ loading: true, err: false });

    try {
      const { newRepo, repositories } = this.state;

      const repoExists = repositories.find(repo => repo.name === newRepo);

      if (newRepo === '') throw 'emptyInput'

      if (repoExists) throw 'repoExists'

      const response = await api.get(`/repos/${newRepo}`);

      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        loading: false,
      });
    } catch (err) {
      if (err === 'repoExists') {
        (alert('Repositório duplicado'))
        this.setState({ newRepo: '' })
      }
      if (err === 'emptyInput') {
        (alert('Você precisa indicar um repositório'))
      }
      else {
        this.setState({ err: true })
      }
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { newRepo, loading, repositories, err } = this.state;

    return (
      <Container>
        <h1>
          <FaGitAlt />
          Repositórios
        </h1>
        <Error err={err}>
          {err && (<p>Repositório não encontrado</p>)}
        </Error>
        <Form onSubmit={this.handleSubmit} err={err}>
          <input
            err={err}
            type="text"
            placeholder="Adicione o 'Nome de usuário / nome do repositório'"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading}>
            {loading ? ( // If the loading is true show the Spinner icon
              <FaSpinner color="#FFF" size={14} />
            ) : ( // Else Show the plus icon
                <FaPlus color="#FFF" size={14} />
              )}
          </SubmitButton>
        </Form>
        <List>
          {repositories.map(repository =>
            <li key={repository.name}>
              <span>{repository.name}</span>
              <div>
                <Link to={`/repository/${encodeURIComponent(repository.name)}`}>Detalhes</Link>
                <DeleteButton onDelete={() => this.handleDelete(repository)}><FaTrashAlt color="#FFF" size={12} /></DeleteButton>
              </div>
            </li>
          )}
        </List>
      </Container >
    );
  }
}
