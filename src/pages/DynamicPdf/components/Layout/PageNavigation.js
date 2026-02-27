// components/Layout/PageNavigation.js - Working with Container layout
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPage } from '../../store/actions';
import { Card, CardBody } from 'reactstrap';

const PageNavigation = () => {
    const dispatch = useDispatch();
    
    const { pages, currentPageId } = useSelector(state => state.pdfBuilder || { pages: [] });

    return (
        <Card className='mt-3' style={{ height: '80px' }}>
            <CardBody>
                <h6 className="text-center mb-3" style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    Pages
                </h6>
                <div className="d-flex flex-wrap gap-2 justify-content-center" style={{maxHeight: '50px'}}>
                    {pages && pages.length > 0 ? (
                        pages.map((page, index) => (
                            <button 
                                key={page.id} 
                                onClick={() => dispatch(setCurrentPage(page.id))}
                                className={`btn btn-sm d-flex align-items-center justify-content-center ${
                                    currentPageId === page.id 
                                        ? 'btn-primary' 
                                        : 'btn-outline-secondary'
                                }`}
                                style={{
                                    width: '60px',
                                    height: '20px',
                                    fontSize: '10px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {index + 1}
                            </button>
                        ))
                    ) : (
                        <div className="text-center text-muted" style={{ fontSize: '12px', padding: '20px 0' }}>
                            No pages available
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
};

export default PageNavigation;