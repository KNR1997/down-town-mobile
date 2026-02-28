import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
// config
import { Routes } from '@/config/routes';
// utils
import { useIsRTL } from '@/utils/locals';
// types
import { SortOrder, Warehouse } from '@/types';
import { MappedPaginatorInfo } from '@/types';
// settings
import { siteSettings } from '@/settings/site.settings';
// components
import { Table } from '@/components/ui/table';
import Pagination from '@/components/ui/pagination';
import TitleWithSort from '@/components/ui/title-with-sort';
import { NoDataFound } from '@/components/icons/no-data-found';
import LanguageSwitcher from '@/components/ui/lang-action/action';

export type IProps = {
  warehouses: Warehouse[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (key: number) => void;
  onOrdering: (current: any) => void;
};
const WarehouseList = ({
  warehouses,
  paginatorInfo,
  onPagination,
  onOrdering,
}: IProps) => {
  const { t } = useTranslation();
  const rowExpandable = (record: any) => record.children?.length;
  const { alignLeft, alignRight } = useIsRTL();
  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      const nextSort =
        sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc;

      const ordering = nextSort === SortOrder.Desc ? `-${column}` : column;

      onOrdering(ordering);
      setSortingObj({
        sort: nextSort,
        column: column,
      });
    },
  });

  const columns = [
    {
      title: t('table:table-item-id'),
      dataIndex: 'id',
      key: 'id',
      align: alignLeft,
      width: 120,
      render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-title')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'name'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      width: 180,
      onHeaderCell: () => onHeaderClick('name'),
      render: (name: string, { image }: { image: any }) => {
        return (
          <div className="flex items-center">
            <div className="relative aspect-square h-10 w-10 shrink-0 overflow-hidden rounded border border-border-200/80 bg-gray-100 me-2.5">
              <Image
                src={image?.thumbnail ?? siteSettings.product.placeholder}
                alt={name}
                fill
                priority={true}
                sizes="(max-width: 768px) 100vw"
              />
            </div>
            <span className="truncate font-medium">{name}</span>
          </div>
        );
      },
    },
    {
      title: t('table:table-item-code'),
      dataIndex: 'code',
      key: 'code',
      ellipsis: true,
      align: alignLeft,
      width: 200,
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      width: 120,
      render: (id: string, record: Warehouse) => (
        <LanguageSwitcher
          slug={id}
          record={record}
          deleteModalView="DELETE_WAREHOUSE"
          routes={Routes?.warehouse}
        />
      ),
    },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={() => (
            <div className="flex flex-col items-center py-7">
              <NoDataFound className="w-52" />
              <div className="mb-1 pt-6 text-base font-semibold text-heading">
                {t('table:empty-table-data')}
              </div>
              <p className="text-[13px]">{t('table:empty-table-sorry-text')}</p>
            </div>
          )}
          data={warehouses}
          rowKey="id"
          scroll={{ x: 1000 }}
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default WarehouseList;
