/* eslint-disable jsx-a11y/accessible-emoji */
import cn from 'classnames';
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const preparedProducts = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    item => item.id === product.categoryId,
  );
  const user = usersFromServer.find(person => person.id === category.ownerId);
  const good = product;

  return { product: good, category, user };
});

const productsToUse = (usersFilter, categoriesFilter, query) => {
  return preparedProducts.filter(product => {
    return (
      (!usersFilter || product.user.name === usersFilter) &&
      (!categoriesFilter || product.category.title === categoriesFilter) &&
      (!query ||
        product.product.name.toLowerCase().includes(query.trim().toLowerCase()))
    );
  });
};

export const App = () => {
  const [usersFilter, setUsersFilter] = useState('');
  const [categoriesFilter, setCategoriesFilter] = useState('');
  const [query, setQuery] = useState('');

  const visibleProducts = productsToUse(usersFilter, categoriesFilter, query);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setUsersFilter('')}
                className={cn({ 'is-active': usersFilter === '' })}
              >
                All
              </a>
              {usersFromServer.map(item => (
                <a
                  key={item.id}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => setUsersFilter(item.name)}
                  className={cn({ 'is-active': item.name === usersFilter })}
                >
                  {item.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => {
                    setQuery(event.target.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button mr-2 my-1', {
                  'is-success': categoriesFilter === '',
                })}
                onClick={() => setCategoriesFilter('')}
              >
                All
              </a>
              {categoriesFromServer.map(item => (
                <a
                  key={item.id}
                  data-cy="Category"
                  href="#/"
                  onClick={() => setCategoriesFilter(item.title)}
                  className={cn('button mr-2 my-1', {
                    'is-info': item.title === categoriesFilter,
                  })}
                >
                  {item.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setCategoriesFilter('');
                  setQuery('');
                  setUsersFilter('');
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        {visibleProducts.length > 0 ? (
          <div className="box table-container">
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(item => {
                  return (
                    <tr data-cy="Product" key={item.product.id}>
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {item.product.id}
                      </td>

                      <td data-cy="ProductName">{item.product.name}</td>
                      <td data-cy="ProductCategory">
                        {`${item.category.icon} - ${item.category.title}`}
                      </td>

                      <td
                        data-cy="ProductUser"
                        className={`${item.user.sex === 'f' ? 'has-text-danger' : 'has-text-link'}`}
                      >
                        {item.user.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>
        )}
      </div>
    </div>
  );
};
