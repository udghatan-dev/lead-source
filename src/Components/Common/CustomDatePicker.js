import React, { useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import ShortcutButtonsPlugin from 'shortcut-buttons-flatpickr';

const getQuickOptInCode = (option) => {
  switch (option) {
    case 1:
      return 'today';

    case 2:
      return 'yesterday';

    case 3:
      return 'last_7d';

    case 4:
      return 'last_14d';

    case 5:
      return 'last_28d';

    case 6:
      return 'last_30d';

    case 7:
      return 'last_90d';

    case 8:
      return 'NONE';

    default:
      break;
  }
};

const QuickSelectionButtons = (timestampRange) => {
  var diff = timestampRange.end - timestampRange.start;
  return [
    {
      label: 'Quick Options',
      attributes: {
        class: 'btn btn-sm bg-transparent d-flex justify-content-center align-items-center w-100 my-2 disabled text-dark border-0',
      },
    },
    {
      label: 'Today',
      attributes: { class: diff < 86340 ? 'btn btn-sm btn-success m-1 py-0' : 'btn btn-sm btn-soft-success m-1 py-0' },
    },
    {
      label: 'Yesterday',
      attributes: { class: diff === 86340 ? 'btn btn-sm btn-success m-1 py-0' : 'btn btn-sm btn-soft-success m-1 py-0' },
    },
    {
      label: 'Last 7 Days',
      attributes: { class: diff === 86400 * 7 ? 'btn btn-sm btn-success m-1 py-0' : 'btn btn-sm btn-soft-success m-1 py-0' },
    },
    {
      label: 'Last 14 Days',
      attributes: { class: diff === 86400 * 14 ? 'btn btn-sm btn-success m-1 py-0' : 'btn btn-sm btn-soft-success m-1 py-0' },
    },
    {
      label: 'Last 28 Days',
      attributes: { class: diff === 86400 * 28 ? 'btn btn-sm btn-success m-1 py-0' : 'btn btn-sm btn-soft-success m-1 py-0' },
    },
    {
      label: 'Last 30 Days',
      attributes: { class: diff === 86400 * 30 ? 'btn btn-sm btn-success m-1 py-0' : 'btn btn-sm btn-soft-success m-1 py-0' },
    },
    {
      label: 'This Quarter',
      attributes: { class: diff === 86400 * 90 ? 'btn btn-sm btn-success m-1 py-0' : 'btn btn-sm btn-soft-success m-1 py-0' },
    },
    {
      label: 'Clear All',
      attributes: { class: 'btn btn-sm btn-soft-danger m-1 py-0' },
    },
  ];
};

const CustomDatePicker = ({ placeholder, onButtonClick, onChange, range, timestampRange, maxData = undefined, minData = undefined }) => {
  const [currentRange, setCurrentRange] = useState({ start: 0, end: 0 });
  useEffect(() => {
    setCurrentRange(timestampRange);
  }, [timestampRange]);

  const FlatPickerComponent = () => {
    return (
      <Flatpickr
        placeholder={placeholder}
        data-provider='flatpickr'
        data-date-format='d-M-Y'
        data-range-date={true}
        className='form-control'
        value={range}
        options={{
          mode: 'range',
          dateFormat: 'd-M-Y',
          maxDate: maxData,
          minDate: minData,
          plugins: [
            new ShortcutButtonsPlugin({
              button: QuickSelectionButtons(currentRange),
              onClick: (e) => {
                if (e === 0) {
                  return;
                }
                onButtonClick(getQuickOptInCode(e));
              },
            }),
          ],
        }}
        onChange={(e) => {
          if (e.length > 1) {
            onChange(e);
          }
        }}
      />
    );
  };
  return (
    <React.Fragment>
      <FlatPickerComponent />
    </React.Fragment>
  );
};

export default CustomDatePicker;
