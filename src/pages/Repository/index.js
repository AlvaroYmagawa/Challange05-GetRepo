import React, { Component } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Container from '../../components/Container'
import { Loading, Owner, Filter, IssueList, PageButton } from './styles';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        issues: PropTypes.string,
      }),
    }).isRequired,
  }

  state = {
    repository: {},
    issues: [],
    filters: [
      { state: 'all', label: 'Todas', active: true },
      { state: 'open', label: 'Abertas', active: false },
      { state: 'closed', label: 'Fechadas', active: false },
    ],
    filterIndex: 0,
    page: 1,
    loading: true,
  }

  async componentDidMount() {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    /*When you have 2 or more async processes that do not depends the end of a process to start your,
      you can use the Promise.all that execute all the processes in the same time.
      To get the return of each process you will need to create a array to receive then,
      then order the return like the order of the processes. */
    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`),
    ])

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    })
  }

  getFilterIndex = async filterIndex => {
    await this.setState({ filterIndex })
    this.loadIssues();
  }

  handlePages = async action => {
    const { page } = this.state;

    await this.setState({ page: action === 'back' ? page - 1 : page + 1 })

    this.loadIssues();
  }

  loadIssues = async () => {
    const { match } = this.props;
    const { filters, filterIndex, page } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    const response = await api.get(`/repos/${repoName}/issues`, {
      params: {
        state: filters[filterIndex].state,
        per_page: 5,
        page,
      },
    });

    this.setState({ issues: response.data });
  }

  render() {
    const { repository, issues, loading, filters, page } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <Filter>
          {filters.map((filter, index) => (
            <button
              type="button"
              key={filter.label}
              onClick={() => this.getFilterIndex(index)}
            >
              {filter.state}
            </button>
          ))}
        </Filter>

        <IssueList>
          {
            issues.map(issue =>
              (
                <li key={String(issue.id)}>
                  <img src={issue.user.avatar_url} alt={issue.user.login} />
                  <div>
                    <strong>
                      <a href={issue.html_url}>{issue.title}</a>

                      {issue.labels.map(label => (
                        <span key={String(label.id)}>{label.name}</span>
                      ))}
                    </strong>
                    <p>{issue.user.login}</p>
                  </div>
                </li>
              ))
          }
        </IssueList>
        <PageButton page={page}>
          {page >= 2 && (<button onClick={() => this.handlePages('back')}>Back</button>)}
          <button onClick={() => this.handlePages('next')}> Next</button>
        </PageButton>
      </Container >
    )
  }
}
