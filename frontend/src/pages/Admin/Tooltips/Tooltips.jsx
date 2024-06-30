import {
  AppBadge,
  AppButton,
  AppContainer,
  AppInput,
  AppSeperateText,
  AppToggle,
} from '@/components/index.jsx';
import {IconEdit, IconPen, IconSearchFilled, IconTrash} from '@/components/Icons/AppIcon.jsx';
import useTabs from '@/hooks/useTabs.jsx';
import useEditApi from '@/hooks/api/useEditApi.jsx';
import useTooltipForm from '@/pages/Admin/Tooltips/useTooltipForm.jsx';
import {useDispatch} from 'react-redux';
import {setDialog} from '@/reducers/layout/dialogSlice.js';
import useDeleteApi from '@/hooks/api/useDeleteApi.jsx';
import usePaginate from '@/hooks/api/usePaginate.jsx';
import {formatFullTime} from '@/helper/format/formatTime.js';

Tooltips.propTypes = {};

function Tooltips() {
  const dispatch = useDispatch();
  const {data, reFresh, onQueriesChange, queries} = usePaginate({
    url: '/tooltips/filter',
    defaultData: [],
    defaultQueries: {
      limit: 20,
    },
    keepPreviousData: true,
  });
  const {handleEdit, editing} = useEditApi({
    url: '/tooltips',
    successCallback: () => reFresh(),
  });
  const {handleDelete, deleting} = useDeleteApi({
    url: '/tooltips',
    successCallback: () => reFresh(),
  });
  const {modal, openModal} = useTooltipForm({successCallback: () => reFresh()});
  const {btnTabs} = useTabs({
    tabs: [
      {
        content: 'Tất cả',
        id: null,
      },
      {
        content: 'Đang hiển thị',
        id: false,
      },
      {
        content: 'Đang ẩn',
        id: true,
      },
    ],
    initSelected: null,
    size: 'lg',
    onTab: (id) => onQueriesChange({isAdminHidden: id}),
  });
  const confirmDelete = (item = {}) => {
    dispatch(
      setDialog({
        type: 'warning',
        content: (
          <p>
            Bạn muốn xóa <span className="fw-600">{item.title}</span>
          </p>
        ),
        onAccept: () => handleDelete(item._id),
        loading: deleting,
      }),
    );
  };

  return (
    <AppContainer className="App-AdminContent" paddingInline={120}>
      {modal}
      <div className="AdminContent__Filter">
        {btnTabs}
        <div className="w-400 d-flex gap-12">
          <AppInput
            placeholder="Tìm kiếm theo tên hoặc nội dung"
            icon={IconSearchFilled}
            value={queries?.searchText}
            onChange={(val) => onQueriesChange({searchText: val})}
          />
          <AppButton icon={IconPen} onClick={() => openModal({})}>
            Thêm mới
          </AppButton>
        </div>
      </div>
      <div className="d-flex-col gap-24">
        <div className="row gap-12 pt-12 pb-12 bg-50">
          <div className="fs-14 fw-700 w-48 d-center">STT</div>
          <div className="fs-14 fw-700 col-1p6 d-center">Tiêu đề</div>
          <div className="fs-14 fw-700 flex-1 d-center">Ảnh bìa</div>
          <div className="fs-14 fw-700 col-1p6 d-center">Ngày đăng</div>
          <div className="fs-14 fw-700 col-1p6 d-center">Trạng thái</div>
          <div className="fs-14 fw-700 col-1p6 d-center">Hành động</div>
        </div>
        {data.map((tooltip, index) => (
          <div key={tooltip._id}>
            <div className="row gap-12 mb-48">
              <div className="w-48 pl-8 fw-600">{index + 1}</div>
              <div className="col-1p6 fw-500">{tooltip.title}</div>
              <div className="flex-1">
                <img
                  src={tooltip.image?.url || '/dummy-image.png'}
                  alt={''}
                  className="w-full h-full"
                />
              </div>
              <div className="col-1p6 d-flex-col ai-c">{formatFullTime(tooltip.createdAt)}</div>
              <div className="col-1p6 d-flex-col ai-c">
                <AppBadge tone={tooltip.isAdminHidden ? 'disabled' : 'success'}>
                  {tooltip.isAdminHidden ? 'Ẩn' : 'Hiển thị'}
                </AppBadge>
              </div>
              <div className="col-1p6">
                <div className="d-flex-col ai-e pr-16 gap-8">
                  <AppToggle
                    checked={!tooltip.isAdminHidden}
                    setChecked={() =>
                      handleEdit({isAdminHidden: !tooltip.isAdminHidden}, tooltip._id)
                    }
                    label={tooltip.isAdminHidden ? 'Hiển thị' : 'Ẩn'}
                    loading={editing}
                  />
                  <AppButton
                    type="no-text-1"
                    icon={IconEdit}
                    onClick={() => openModal(tooltip)}
                    loading={editing}
                  />
                  <AppButton
                    type="no-text-1"
                    icon={IconTrash}
                    loading={editing}
                    onClick={() => confirmDelete(tooltip)}
                  />
                </div>
              </div>
            </div>
            <AppSeperateText />
          </div>
        ))}
      </div>
    </AppContainer>
  );
}

export default Tooltips;
