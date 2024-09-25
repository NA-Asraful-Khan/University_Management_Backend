import { Router } from 'express';

export const setPaginationNotAllowed = (router: Router): void => {
  router.get('/pagination', (req, res) => {
    res.status(403).json({
      success: false,
      message: 'Pagination action is not allowed for this resource.',
    });
  });
};
export const setPatchNotAllowed = (router: Router): void => {
  router.patch('/:id', (req, res) => {
    res.status(403).json({
      success: false,
      message: 'Patch action is not allowed for this resource.',
    });
  });
};

export const setPutNotAllowed = (router: Router): void => {
  router.put('/:id', (req, res) => {
    res.status(403).json({
      success: false,
      message: 'Put action is not allowed for this resource.',
    });
  });
};

export const setDeleteNotAllowed = (router: Router): void => {
  router.delete('/:id', (req, res) => {
    res.status(403).json({
      success: false,
      message: 'Delete action is not allowed for this resource.',
    });
  });
};
