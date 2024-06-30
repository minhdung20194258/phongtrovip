import {AppSkeleton} from '@/components/index.jsx';

AdminSkeleton.propTypes = {};

function AdminSkeleton() {
  return (
    <div className="d-flex pt-48 pl-200 gap-100">
      <div style={{width: '30%'}}>
        <AppSkeleton multiples={7} />
      </div>
      <div style={{width: '70%'}}>
        <AppSkeleton multiples={7} />
      </div>
    </div>
  );
}

export default AdminSkeleton;
