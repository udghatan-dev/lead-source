import { FiSearch } from 'react-icons/fi';
import { BiLink, BiUnlink } from 'react-icons/bi';
import { Spinner } from 'reactstrap';

const DisplayFields = ({ 
    crmFields, 
    crmSearch, 
    handleCrmSearch, 
    loadingCrm, 
    mappings, 
    handleFieldMapping, 
    handleRemoveMapping,
    crmPagination,
    crmPage,
    handleCrmPageChange,
    availableFormFields,
    usedFormFields
}) => {
    return (
        <div className='row'>
            {/* Left: CRM Fields */}
            <div className='col-md-5'>
                <div
                    className='p-2 rounded mb-2'
                    style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}
                >
                    <h6 className='mb-0' style={{ fontSize: '0.85rem', color: '#0369a1' }}>
                        CRM Fields
                    </h6>
                </div>

                {/* CRM Search */}
                <div className='position-relative mb-2'>
                    <FiSearch
                        style={{
                            position: 'absolute',
                            left: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#94a3b8',
                            fontSize: '0.85rem',
                        }}
                    />
                    <input
                        type='text'
                        className='form-control form-control-sm'
                        style={{ fontSize: '0.83rem', paddingLeft: '30px' }}
                        placeholder='Search CRM fields...'
                        value={crmSearch}
                        onChange={(e) => handleCrmSearch(e.target.value)}
                    />
                </div>

                {loadingCrm ? (
                    <div className='text-center py-4'>
                        <Spinner size='sm' color='primary' />
                        <span className='text-muted ms-2' style={{ fontSize: '0.83rem' }}>Loading...</span>
                    </div>
                ) : crmFields?.length === 0 ? (
                    <p className='text-muted text-center py-3' style={{ fontSize: '0.83rem' }}>
                        No CRM fields found
                    </p>
                ) : (
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {crmFields?.map((field) => {
                            const fieldId = field._id || field.id || field.key;
                            const isMapped = !!mappings[fieldId];

                            return (
                                <div
                                    key={fieldId}
                                    className='d-flex align-items-center gap-2 p-2 mb-1 rounded'
                                    style={{
                                        backgroundColor: isMapped ? '#f0fdf4' : '#f8fafc',
                                        border: `1px solid ${isMapped ? '#bbf7d0' : '#e2e8f0'}`,
                                        fontSize: '0.83rem',
                                    }}
                                >
                                    <div className='flex-grow-1'>
                                        <div className='fw-medium'>{field.name || field.label}</div>
                                        {field.key && (
                                            <span className='text-muted' style={{ fontSize: '0.72rem' }}>
                                                {field.key}
                                            </span>
                                        )}
                                    </div>
                                    {isMapped ? (
                                        <BiLink style={{ color: '#22c55e', fontSize: '1rem', flexShrink: 0 }} />
                                    ) : (
                                        <BiUnlink style={{ color: '#cbd5e1', fontSize: '1rem', flexShrink: 0 }} />
                                    )}
                                </div>
                            );
                        })}

                        {/* CRM Pagination */}
                        {crmPagination?.totalPages > 1 && (
                            <div className='d-flex justify-content-center gap-1 mt-2'>
                                <button
                                    className='btn btn-sm btn-outline-secondary py-0 px-2'
                                    style={{ fontSize: '0.75rem' }}
                                    disabled={crmPage === 1}
                                    onClick={() => handleCrmPageChange(crmPage - 1)}
                                >
                                    Prev
                                </button>
                                <span className='text-muted align-self-center' style={{ fontSize: '0.75rem' }}>
                                    {crmPage} / {crmPagination?.totalPages}
                                </span>
                                <button
                                    className='btn btn-sm btn-outline-secondary py-0 px-2'
                                    style={{ fontSize: '0.75rem' }}
                                    disabled={crmPage === crmPagination?.totalPages}
                                    onClick={() => handleCrmPageChange(crmPage + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Center: Mapping Arrow */}
            <div className='col-md-2 d-flex align-items-center justify-content-center'>
                <div className='text-center'>
                    <BiLink style={{ fontSize: '2rem', color: '#94a3b8' }} />
                    <p className='text-muted mb-0 mt-1' style={{ fontSize: '0.72rem' }}>
                        Map fields
                    </p>
                </div>
            </div>

            {/* Right: Form Fields */}
            <div className='col-md-5'>
                <div
                    className='p-2 rounded mb-2'
                    style={{ backgroundColor: '#faf5ff', border: '1px solid #e9d5ff' }}
                >
                    <h6 className='mb-0' style={{ fontSize: '0.85rem', color: '#7c3aed' }}>
                        Form Fields
                    </h6>
                </div>

                {availableFormFields?.length === 0 ? (
                    <p className='text-muted text-center py-3' style={{ fontSize: '0.83rem' }}>
                        No form fields available
                    </p>
                ) : (
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {availableFormFields?.map((field) => {
                            const fieldKey = field.key || field.id || field.name;
                            const isMapped = usedFormFields.has(fieldKey);

                            return (
                                <div
                                    key={fieldKey}
                                    className='d-flex align-items-center gap-2 p-2 mb-1 rounded'
                                    style={{
                                        backgroundColor: isMapped ? '#faf5ff' : '#f8fafc',
                                        border: `1px solid ${isMapped ? '#e9d5ff' : '#e2e8f0'}`,
                                        fontSize: '0.83rem',
                                    }}
                                >
                                    {isMapped ? (
                                        <BiLink style={{ color: '#7c3aed', fontSize: '1rem', flexShrink: 0 }} />
                                    ) : (
                                        <BiUnlink style={{ color: '#cbd5e1', fontSize: '1rem', flexShrink: 0 }} />
                                    )}
                                    <div className='flex-grow-1'>
                                        <div className='fw-medium'>{field.name || field.label}</div>
                                        {field.key && field.key !== (field.name || field.label) && (
                                            <span className='text-muted' style={{ fontSize: '0.72rem' }}>
                                                {field.key}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DisplayFields;