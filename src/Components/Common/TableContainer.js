import React, { Fragment } from 'react';
import { useParams, withRouter } from 'react-router-dom';

import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useTable, useGlobalFilter, useAsyncDebounce, useSortBy, useFilters, useExpanded, usePagination } from 'react-table';
import SimpleBar from 'simplebar-react';
import { Table, Row, Pagination, PaginationItem, PaginationLink, Col, Button, Input } from 'reactstrap';
import Select from 'react-select';
import { DefaultColumnFilter } from './filters';

// Define a default UI for filtering
function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Col sm={4}>
      <div className='search-box me-2 mb-2 d-inline-block'>
        <div className='position-relative'>
          <label htmlFor='search-bar-0' className='search-label'>
            <span id='search-bar-0-label' className='sr-only'>
              Search this table
            </span>
            <input
              onChange={(e) => {
                setValue(e.target.value);
                onChange(e.target.value);
              }}
              id='search-bar-0'
              type='text'
              className='form-control'
              placeholder={`${count} records...`}
              value={value || ''}
            />
          </label>
          <i className='bx bx-search-alt search-icon'></i>
        </div>
      </div>
    </Col>
  );
}

const TableContainer = (props) => {
  const {
    columns,
    data,
    isGlobalSearch,
    isGlobalFilter,
    isAddOptions,
    isAddUserList,
    isCustomPagination,
    activePageIndex,
    goTo,
    onclickevent,
    onclickaction,
    masterCheck,
    selectMultiple,
    totalRecords,
    handleOrderClicks,
    handleUserClick,
    handleCustomerClick,
    isAddCustList,
    customPageSize,
    tableClass,
    theadClass,
    thClass,
    showCustomizePagination,
    rows,
    customization,
    divClass,
  } = props;
  var {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: { pageIndex: 0, pageSize: parseInt(customPageSize) },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  );

  const generateSortingIndicator = (column) => {
    return column.isSorted ? (column.isSortedDesc ? ' ' : '') : '';
  };

  const onChangeInSelect = (event) => {
    setPageSize(Number(event.target.value));
  };
  const onChangeInInput = (event) => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0;
    gotoPage(page);
  };

  const [cPage, setCPage] = React.useState(0);
  React.useEffect(() => {
    setCPage(activePageIndex);
    if (rows !== undefined) setPageSize(rows);
  }, [data]);

  const [dimensions, setDimensions] = React.useState();

  function handleResize() {
    setDimensions({
      height: document.documentElement.clientHeight,
      width: document.documentElement.clientWidth,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      contentWidth: document.getElementById('tableDiv')?.offsetWidth,
      offsetWidth: document.getElementById('tableContainerDiv')?.offsetWidth,
    });
  }

  React.useEffect(() => {
    window.addEventListener('resize', handleResize);

    return (_) => {
      window.removeEventListener('resize', handleResize);
    };
  });

  React.useEffect(() => {
    setTimeout(() => {
      handleResize();
    }, 1000);
  }, []);

  return (
    <Fragment>
      {isGlobalSearch ||
        isGlobalFilter ||
        isAddOptions ||
        isAddUserList ||
        (isAddCustList && (
          <Row className='mb-2'>
            {isGlobalSearch && (
              <Col md={1}>
                <select className='form-select' value={pageSize} onChange={onChangeInSelect}>
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </Col>
            )}
            {isGlobalFilter && (
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            )}
            {isAddOptions && (
              <Col sm='7'>
                <div className='text-sm-end'>
                  <Button type='button' color='success' className='btn-rounded  mb-2 me-2' onClick={handleOrderClicks}>
                    <i className='mdi mdi-plus me-1' />
                    Add New Order
                  </Button>
                </div>
              </Col>
            )}
            {isAddUserList && (
              <Col sm='7'>
                <div className='text-sm-end'>
                  <Button type='button' color='primary' className='btn mb-2 me-2' onClick={handleUserClick}>
                    <i className='mdi mdi-plus-circle-outline me-1' />
                    Create New User
                  </Button>
                </div>
              </Col>
            )}
            {isAddCustList && (
              <Col sm='7'>
                <div className='text-sm-end'>
                  <Button type='button' color='success' className='btn-rounded mb-2 me-2' onClick={handleCustomerClick}>
                    <i className='mdi mdi-plus me-1' />
                    New Customers
                  </Button>
                </div>
              </Col>
            )}
          </Row>
        ))}

      {dimensions !== undefined && dimensions.contentWidth <= dimensions.offsetWidth ? (
        <div id='tableContainerDiv' className='table-card mb-3'>
          <Table hover {...getTableProps()} className={tableClass} id='tableDiv'>
            <thead className={theadClass}>
              {headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => {
                    if (column.visibility !== false) {
                      if (column.Header === '#') {
                        return (
                          <th key={column.id} className={thClass} {...column.getSortByToggleProps()}>
                            <div className='form-check'>
                              <input
                                className='form-check-input'
                                type='checkbox'
                                checked={masterCheck}
                                onChange={(e) => selectMultiple(e)}
                              />
                            </div>
                          </th>
                        );
                      } else {
                        return (
                          <th key={column.id} className={thClass} {...column.getSortByToggleProps()}>
                            {column.render('Header')}
                            {generateSortingIndicator(column)}
                          </th>
                        );
                      }
                    }
                  })}
                </tr>
              ))}
            </thead>

            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <Fragment key={row.getRowProps().key}>
                    <tr>
                      {row.cells.map((cell, ci) => {
                        if (ci > 0 && ci + 1 !== row.cells.length && onclickevent !== undefined) {
                          if (cell.column.visibility !== false) {
                            return (
                              <td
                                key={cell.id}
                                {...cell.getCellProps()}
                                onClick={() => {
                                  onclickevent(onclickaction, cell);
                                }}
                              >
                                {cell.render('Cell')}
                              </td>
                            );
                          }
                        } else {
                          if (cell.column.visibility !== false) {
                            return (
                              <td key={cell.id} {...cell.getCellProps()}>
                                {cell.render('Cell')}
                              </td>
                            );
                          }
                        }
                      })}
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </Table>
        </div>
      ) : (
        <SimpleBar className={divClass} id='tableContainerDiv'>
          <Table hover {...getTableProps()} className={tableClass} id='tableDiv'>
            <thead className={theadClass}>
              {headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => {
                    if (column.visibility !== false) {
                      if (column.Header === '#') {
                        return (
                          <th key={column.id} className={thClass} {...column.getSortByToggleProps()}>
                            <div className='form-check'>
                              <input
                                className='form-check-input'
                                type='checkbox'
                                checked={masterCheck}
                                onChange={(e) => selectMultiple(e)}
                              />
                            </div>
                          </th>
                        );
                      } else {
                        return (
                          <th key={column.id} className={thClass} {...column.getSortByToggleProps()}>
                            {column.render('Header')}
                            {generateSortingIndicator(column)}
                          </th>
                        );
                      }
                    }
                  })}
                </tr>
              ))}
            </thead>

            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <Fragment key={row.getRowProps().key}>
                    <tr>
                      {row.cells.map((cell, ci) => {
                        if (ci > 0 && ci + 1 !== row.cells.length && onclickevent !== undefined) {
                          if (cell.column.visibility !== false) {
                            return (
                              <td
                                key={cell.id}
                                {...cell.getCellProps()}
                                onClick={() => {
                                  onclickevent(onclickaction, cell);
                                }}
                              >
                                {cell.render('Cell')}
                              </td>
                            );
                          }
                        } else {
                          if (cell.column.visibility !== false) {
                            return (
                              <td key={cell.id} {...cell.getCellProps()}>
                                {cell.render('Cell')}
                              </td>
                            );
                          }
                        }
                      })}
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </Table>
        </SimpleBar>
      )}

      {totalRecords === 0 && <Row className=' justify-content-center align-items-start pe-2'>No Data Found</Row>}

      <Row className='justify-content-md-end justify-content-center align-items-start pe-2'>
        {isCustomPagination === true ? (
          <>
            {showCustomizePagination !== undefined ? (
              <Col lg={6} xl={6}>
                <div className='d-flex m-0 justify-content-start'>
                  {/* <div className="col-4">
                    <div className="d-flex align-items-center justify-content-start">
                      <input className="form-control form-control-sm w-50" value={cPage} type="number" placeholder="Ex. 12" max={parseInt(totalRecords / (showCustomizePagination !== undefined ? rows : 20)) + 1} onChange={(e) => {
                        if (parseInt(e.target.value) <= parseInt(totalRecords / (showCustomizePagination !== undefined ? rows : 20)) + 1)
                          setCPage(parseInt(e.target.value));
                      }} />
                      <button className="btn btn-sm btn-primary justify-content-start" onClick={() => { customization("page", cPage) }}>Go To Page</button>
                    </div>
                  </div> */}
                  <div className='col-12 mx-1'>
                    <div className='d-flex align-items-center justify-content-start'>
                      <input
                        className='form-control form-control-sm w-25'
                        value={cPage}
                        type='number'
                        placeholder='Ex. 12'
                        max={parseInt(totalRecords / (showCustomizePagination !== undefined ? rows : 20)) + 1}
                        onChange={(e) => {
                          if (parseInt(e.target.value) <= parseInt(totalRecords / (showCustomizePagination !== undefined ? rows : 20)) + 1)
                            setCPage(parseInt(e.target.value));
                        }}
                      />
                      &nbsp;&nbsp;
                      <button
                        className='btn btn-sm btn-primary justify-content-start'
                        onClick={() => {
                          customization('page', cPage);
                        }}
                      >
                        Go To Page
                      </button>
                      &nbsp;&nbsp;
                      <label className='form-control-label'>Records Per Page</label>&nbsp;&nbsp;
                      <select
                        className='form-select form-select-sm w-25'
                        onChange={(e) => {
                          customization('rows', e.target.value);
                        }}
                      >
                        &nbsp;&nbsp;
                        <option value={20} selected={rows !== undefined && rows === 20 ? true : false}>
                          20
                        </option>
                        <option value={50} selected={rows !== undefined && rows === 50 ? true : false}>
                          50
                        </option>
                        <option value={100} selected={rows !== undefined && rows === 100 ? true : false}>
                          100
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </Col>
            ) : (
              ''
            )}
            <Col lg={6} xl={6}>
              <Pagination size='sm' listClassName='justify-content-end'>
                <PaginationItem
                  disabled={activePageIndex <= 1 ? true : false}
                  onClick={() => {
                    goTo(activePageIndex - 2);
                  }}
                >
                  {' '}
                  <PaginationLink to='#'> ← &nbsp; Prev </PaginationLink>{' '}
                </PaginationItem>
                <PaginationItem active>
                  {' '}
                  <PaginationLink to='#'>
                    {' '}
                    Page {activePageIndex} of{' '}
                    {isNaN(totalRecords)
                      ? 'Many'
                      : parseInt(totalRecords / (showCustomizePagination !== undefined ? rows : 20)) + (totalRecords === 20 ? 0 : 1)}
                  </PaginationLink>{' '}
                </PaginationItem>
                <PaginationItem
                  disabled={
                    parseInt(totalRecords / (showCustomizePagination !== undefined ? rows : 20)) + (totalRecords === 20 ? 0 : 1) ===
                    activePageIndex
                      ? true
                      : false
                  }
                >
                  {' '}
                  <PaginationLink
                    to='#'
                    onClick={() => {
                      goTo(activePageIndex);
                    }}
                  >
                    {' '}
                    Next &nbsp; →{' '}
                  </PaginationLink>{' '}
                </PaginationItem>
              </Pagination>
              {/* <Pagination size='sm' listClassName="justify-content-end">
                <PaginationItem disabled={true}> <PaginationLink to="#" className="text-primary"> {(((activePageIndex - 1) === 0 ? 1 : (activePageIndex - 1) * rows)) + " to " + (((activePageIndex - 1) * rows) + page.length) + " of " + totalRecords + " contacts"}</PaginationLink> </PaginationItem>
              </Pagination> */}
            </Col>
          </>
        ) : (
          <>
            <Col className='col-md-auto'>
              <div className='d-flex gap-1'>
                <Button className='btn-sm' color='primary' onClick={previousPage} disabled={!canPreviousPage}>
                  {'<'}
                </Button>
              </div>
            </Col>
            <Col className='col-md-auto d-none d-md-block'>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>
            </Col>
            <Col className='col-md-auto'>
              <Input
                type='number'
                min={1}
                style={{ width: 70 }}
                max={pageOptions.length}
                defaultValue={pageIndex + 1}
                onChange={onChangeInInput}
                className='form-control-sm'
              />
            </Col>

            <Col className='col-md-auto'>
              <div className='d-flex gap-1'>
                <Button className='btn-sm' color='primary' onClick={nextPage} disabled={!canNextPage}>
                  {'>'}
                </Button>
              </div>
            </Col>
          </>
        )}
      </Row>
    </Fragment>
  );
};

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(TableContainer));
