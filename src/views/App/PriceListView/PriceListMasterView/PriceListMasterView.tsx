import React, { useMemo } from "react";
import { Moment } from "moment";
import { Col, Row, Tooltip } from "antd";
import Card from "antd/lib/card";
import Table, { ColumnProps } from "antd/lib/table";
import classNames from "classnames";
import AdvanceIdFilter from "components/Utility/AdvanceFilter/AdvanceIdFilter/AdvanceIdFilter";
import AdvanceStringFilter from "components/Utility/AdvanceFilter/AdvanceStringFilter/AdvanceStringFilter";
import InputSearch from "components/Utility/InputSearch/InputSearch";
import Pagination from "components/Utility/Pagination/Pagination";
import { renderMasterIndex } from "helpers/table";
import { PriceList, PriceListFilter } from "models/PriceList";
import { PriceListStatusFilter } from "models/PriceList/PriceListStatusFilter";
import { SalesOrderTypeFilter } from "models/PriceList/SalesOrderTypeFilter";
import { useTranslation } from "react-i18next";
import { priceListRepository } from "repositories/price-list-repository";
import masterService from "services/pages/master-service";
import nameof from "ts-nameof.macro";
import { IdFilter, StringFilter } from "@react3l/advanced-filters";
import { formatDateTime } from "helpers/date-time";

function PriceListMasterView() {
  const [translate] = useTranslation();

  const {
    list,
    total,
    loadingList,
    filter,
    toggle,
    handleChangeFilter,
    handleResetFilter,
    handleGoCreate,
    handleGoDetail,
    handleToggleSearch,
    handleTableChange,
    handlePagination,
    handleServerDelete,
    handleServerBulkDelete,
    rowSelection,
    canBulkDelete,
    pagination, // optional using
  } = masterService.useMaster<PriceList, PriceListFilter>(
    PriceListFilter,
    priceListRepository.list,
    priceListRepository.count,
    priceListRepository.delete,
    priceListRepository.bulkDelete,
  );

  const columns: ColumnProps<PriceList>[] = useMemo(
    () => [
      {
        title: translate("general.columns.index"),
        key: "index",
        width: 100,
        render: renderMasterIndex<PriceList>(pagination),
      },
      {
        title: translate("priceList.code"),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
      },
      {
        title: translate("priceList.name"),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
      },
      {
        title: (
          <div className='text-center'>{translate("priceList.updatedAt")}</div>
        ),
        key: nameof(list[0].updatedAt),
        dataIndex: nameof(list[0].updatedAt),
        render(...params: [Moment, PriceList, number]) {
          return <div className='text-center'>{formatDateTime(params[0])}</div>;
        },
      },
      {
        title: (
          <div className='text-center'>{translate("priceList.status")}</div>
        ),
        key: nameof(list[0].statusId),
        dataIndex: nameof(list[0].statusId),
        render(...params: [number, PriceList, number]) {
          return (
            <div className={params[0] === 1 ? "active" : ""}>
              <i className='tio-checkmark_circle d-flex justify-content-center'></i>
            </div>
          );
        },
      },
      {
        title: translate("general.actions.label"),
        key: "action",
        dataIndex: nameof(list[0].id),
        width: 200,
        align: "center",
        render(id: number, priceList: PriceList) {
          return (
            <div className='d-flex justify-content-center button-action-table'>
              <Tooltip title={translate("general.actions.view")}>
                <button className='btn gradient-btn-icon'>
                  <i className='tio-visible' />
                </button>
              </Tooltip>
              <Tooltip title={translate("general.actions.edit")}>
                <button
                  className='btn gradient-btn-icon'
                  onClick={handleGoDetail(id)}
                >
                  <i className='tio-edit' />
                </button>
              </Tooltip>
              {/* {!product.used && validAction('delete') && ( */}
              <Tooltip title={"delete"}>
                <button
                  className='btn btn-sm component__btn-delete'
                  onClick={() => handleServerDelete(priceList)}
                >
                  <i className='tio-delete' />
                </button>
              </Tooltip>
              {/* )} */}
            </div>
          );
        },
      },
    ],

    [handleGoDetail, handleServerDelete, list, pagination, translate],
  );

  return (
    <div className='page page__master'>
      {/* start master header */}
      <div className='page__header d-flex align-items-center justify-content-between'>
        <div className='page__title'>
          {translate("paymentRequest.master.title")}
        </div>
        <div className='page__actions d-flex align-items-center'>
          <button
            className='btn btn-sm component__btn-primary ml-3'
            onClick={handleGoCreate}
          >
            {translate("general.actions.create")}
          </button>
        </div>
      </div>
      {/* end master header */}
      {/* start search master */}
      {/* start basic search, normally search like code, name, date, etc. */}
      <div className='page__search'>
        <Card title={translate("general.search.title")}>
          <Row className='d-flex align-items-center'>
            <Col lg={12}>
              <div className='pr-4'>
                <InputSearch />
              </div>
            </Col>
            <Col lg={4} className='pr-4'>
              <div className='mt__1'>
                <label className='label'>
                  {translate("general.priceList.code")}
                </label>
                <AdvanceStringFilter
                  value={filter[nameof(list[0].code)]["contain"]}
                  onBlur={handleChangeFilter(
                    nameof(list[0].code),
                    "contain" as any,
                    StringFilter,
                  )}
                  placeHolder={translate("priceList.filter.code")} // -> tat ca
                />
              </div>
            </Col>
            <Col lg={4} className='pr-4'>
              <div className='mt__1'>
                <label className='label'>
                  {translate("general.priceList.name")}
                </label>
                <AdvanceStringFilter
                  value={filter[nameof(list[0].name)]["contain"]}
                  onChange={handleChangeFilter(
                    nameof(list[0].name),
                    "contain" as any,
                    StringFilter,
                  )}
                  placeHolder={translate("priceList.filter.name")} // -> tat ca
                />
              </div>
            </Col>
            {/* start toggle and reset filter */}
            <Col lg={4}>
              <div className='d-flex justify-content-end'>
                <button
                  className={classNames(
                    "btn component__btn-toggle mr-4",
                    toggle === true ? "component__btn-toggle-active" : "",
                  )}
                  onClick={handleToggleSearch}
                >
                  <div className='tio-down_ui' />
                  <div className='tio-down_ui' />
                </button>
                <div className='d-flex justify-content-between'>
                  <button className='btn btn-info' onClick={handleResetFilter}>
                    ResetFilter
                  </button>
                </div>
              </div>
            </Col>
            {/* end toggle and reset filter */}
          </Row>
          {/* end basic search */}
          {/* start advanced search */}
          {toggle && (
            <>
              <Row className='mt-4'>
                <Col lg={4} className='pr-4'>
                  <label className='label'>
                    {translate("priceList.status")}
                  </label>
                  <AdvanceIdFilter
                    value={filter[nameof(list[0].statusId)]["equal"]}
                    onChange={handleChangeFilter(
                      nameof(list[0].statusId),
                      "equal" as any,
                      IdFilter,
                    )}
                    classFilter={PriceListStatusFilter}
                    getList={priceListRepository.filterListStatus}
                    placeHolder={translate("general.filter.idFilter")}
                  />
                </Col>
                <Col lg={4} className='pr-4'>
                  <label className='label'>
                    {translate("priceList.saleOrderType")}
                  </label>
                  <AdvanceIdFilter
                    value={filter[nameof(list[0].salesOrderTypeId)]["equal"]}
                    onChange={handleChangeFilter(
                      nameof(list[0].salesOrderTypeId),
                      "equal" as any,
                      IdFilter,
                    )}
                    classFilter={SalesOrderTypeFilter}
                    getList={priceListRepository.filterListSalesOrderType}
                    placeHolder={translate("general.filter.idFilter")}
                  />
                </Col>
              </Row>
            </>
          )}
        </Card>
      </div>
      {/* end search master */}
      <div className='page__master-table'>
        <Card>
          <Table
            tableLayout='fixed'
            bordered={true}
            rowKey={nameof(list[0].id)}
            columns={columns}
            pagination={false}
            dataSource={list}
            loading={loadingList}
            onChange={handleTableChange}
            rowSelection={rowSelection}
            title={() => (
              <>
                <div className='d-flex justify-content-between'>
                  <div className='flex-shrink-1 d-flex align-items-center'>
                    <div className='table-title ml-2'>
                      {translate("priceLists.table.title")}
                    </div>
                  </div>

                  <div className='flex-shrink-1 d-flex align-items-center'>
                    <Tooltip title={translate("Xóa tất cả")} key='bulkDelete'>
                      <button
                        className='btn component__btn-delete'
                        onClick={handleServerBulkDelete} // local bulk Delete onChange
                        disabled={!canBulkDelete} // disabled when selectedList length === 0
                      >
                        <i className='tio-delete' />
                      </button>
                    </Tooltip>
                    <Tooltip title={translate("general.actions.importExcel")}>
                      <button className='btn gradient-btn-icon'>
                        <i className='tio-file_add_outlined ' />
                      </button>
                    </Tooltip>
                    <Tooltip title={translate("general.actions.exportExcel")}>
                      <button className='btn gradient-btn-icon'>
                        <i className='tio-file_outlined' />
                      </button>
                    </Tooltip>
                    <Tooltip
                      title={translate("general.actions.downloadTemplate")}
                    >
                      <button className='btn gradient-btn-icon'>
                        <i className='tio-download_to' />
                      </button>
                    </Tooltip>
                    <Pagination
                      skip={filter.skip}
                      take={filter.take}
                      total={total}
                      onChange={handlePagination}
                      style={{ margin: "10px" }}
                    />
                  </div>
                </div>
              </>
            )}
          />
        </Card>
      </div>
    </div>
  );
}

export default PriceListMasterView;
