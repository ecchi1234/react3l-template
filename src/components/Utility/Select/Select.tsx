import React, {RefObject} from 'react';
import './Select.scss';
import classNames from 'classnames';
import { commonWebService } from 'services/common-web-service';
import { Model, ModelFilter } from 'react3l/core';
import Spin from 'antd/lib/spin';
import {debounce} from 'react3l/helpers';
import { DEBOUNCE_TIME_300 } from 'react3l/config';
import { Observable, ErrorObserver } from 'rxjs';
import nameof from 'ts-nameof.macro';
import { StringFilter } from 'react3l-advanced-filters/StringFilter';
import { Empty } from 'antd';
import { commonService } from 'react3l/services/common-service';
import InputSelect from '../InputSelect/InputSelect';

export interface SelectProps<T extends Model, TModelFilter extends ModelFilter> {
  model?: Model;

  modelFilter?: TModelFilter;

  searchProperty?: string;

  searchType?: string;

  placeHolder?: string,

  disabled?: boolean;

  getList?: (TModelFilter?: TModelFilter) => Observable<T[]>;

  setModel?: (T: T ) => void;

  render?: (t: T) => string;
}

function defaultRenderObject<T extends Model>(t: T) {
  return t?.name;
}

function Select(props: SelectProps<Model, ModelFilter>) {
  const {
    model,
    modelFilter,
    searchProperty,
    searchType,
    placeHolder,
    getList,
    setModel,
    render,
  } = props;

  const internalModel = React.useMemo((): Model => {
    return model || null;
  }, [model]);

  const [loading, setLoading] = React.useState<boolean>(false);

  const [list, setList] = React.useState<Model[]>([]);

  const [isExpand, setExpand] = React.useState<boolean>(false);

  const wrapperRef: RefObject<HTMLDivElement> = React.useRef<HTMLDivElement>(null);

  const[subscription] = commonService.useSubscription();  

  const handleLoadList = React.useCallback(
    () => {
      try {
        setLoading(true);
        subscription.add(getList);
        getList(modelFilter).subscribe((res: Model[]) => {
          setList(res);
          setLoading(false);
        }, (err: ErrorObserver<Error>) => {
          setList([]);
          setLoading(false);
        });
      } catch (error) {
      }
    },
    [getList, modelFilter, subscription],
  );

  const handleToggle = React.useCallback (
    async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setExpand(true);
      await handleLoadList();
    }, [handleLoadList],
  );
  
  const handleCloseSelect = React.useCallback(
    () => {
      setExpand(false);
    },
    [],
  );

  const handleClickItem = React.useCallback(
    (item: Model) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setModel(item);
      handleCloseSelect();
    }, 
  [handleCloseSelect, setModel]);

  const handleSearchChange = React.useCallback(debounce((searchTerm: string) => {
    const cloneModelFilter = {...modelFilter};
    cloneModelFilter[searchProperty][searchType] = searchTerm;
    setLoading(true);
    subscription.add(getList);
    getList(cloneModelFilter).subscribe((res: Model[]) => {
      setList(res);
      setLoading(false);
    }, (err: ErrorObserver<Error>) => {
      setList([]);
      setLoading(false);
    });
  }, DEBOUNCE_TIME_300), []);
  
  const handleClearItem = React.useCallback(() => {
    setModel(null);
  }, [setModel]);

  commonWebService.useClickOutside(wrapperRef, handleCloseSelect);
  return <>
    <div className="select__container" ref={wrapperRef}>
      <div className="select__input" onClick={handleToggle}>
        <InputSelect model={internalModel}
          render={render}
          placeHolder={placeHolder}
          expanded={isExpand}
          onSearch={handleSearchChange}
          onClear={handleClearItem}/>
      </div>
      { isExpand &&
        <div className="select__list-container">
          { !loading ? 
            <div className="select__list">
              { list.length > 0 ? 
              list.map((item, index) => 
              <div className={classNames('select__item', {'select__item--selected': item.id === internalModel?.id})}
                  key={index} 
                  onClick={handleClickItem(item)}>
                  <span className="select__text">{render(item)}</span>
              </div>) : 
             <Empty imageStyle={{height: 60}}/>
              }
            </div> : 
            <div className="select__loading">
                  <Spin tip="Loading..."></Spin>
            </div>
          }
        </div>
      }
    </div>
  </>;
}

Select.defaultProps = {
  searchProperty: nameof(Model.prototype.name),
  searchType: nameof(StringFilter.prototype.startWith),
  render: defaultRenderObject,

};

export default Select;

