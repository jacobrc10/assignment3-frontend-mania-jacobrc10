import React from 'react';
import Pagination from 'react-bootstrap/Pagination';
import '../css/Paginations.css';

function IPaginations ({pokemons, pageSize, currentPage, onPageChange}) {
  const pageCount = Math.ceil(pokemons.length / pageSize);
  // Show 10 pages at a time
  let pages = [];
  if (pageCount <= 10) {
    for (let i = 1; i <= pageCount; i++) {
      pages.push(i);
    }
  } else if (currentPage <= 5) {
    for (let i = 1; i <= 10; i++) {
      pages.push(i);
    }
  } else if (currentPage > 5 && currentPage < pageCount - 5) {
    for (let i = currentPage - 5; i <= currentPage + 4; i++) {
      pages.push(i);
    }
  } else {
    for (let i = pageCount - 9; i <= pageCount; i++) {
      pages.push(i);
    }
  }

  return (
    <Pagination>
      { currentPage > 1 &&
        <Pagination.Prev
          onClick={() => onPageChange(currentPage - 1)}
        />
      }
      {
        pages.map(page => (
          <Pagination.Item
            key={page}
            onClick={() => onPageChange(page)}
            active={page === currentPage}
          >
            {page}
          </Pagination.Item>
        ))
      }
      { currentPage < pageCount &&
        <Pagination.Next
          onClick={() => onPageChange(currentPage + 1)}
        />
      }
    </Pagination>
  )
}

export default IPaginations