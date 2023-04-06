import React from 'react';
import '../css/Pagination.css';

function Pagination ({pokemons, pageSize, currentPage, onPageChange}) {
  const pageCount = Math.ceil(pokemons.length / pageSize);
  // Show 10 pages at a time
  let pages = [];
  if (currentPage <= 5) {
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
    <div
    className='pagination'
    >
      { currentPage > 1 &&
        <button
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
      }
      {
        pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{backgroundColor: page === currentPage ? 'green' : null}}
          >
            {page}
          </button>
        ))
      }
      { currentPage < pageCount &&
        <button
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      }
    </div>
  )
}

export default Pagination