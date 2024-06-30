import {LIMIT} from '../const/untils.mjs';

export default function pagination({count = 0, page = 0, limit = LIMIT}) {
  const pageInfo = {
    hasNext: true,
    hasPrev: true,
  };

  if (count <= limit * (page + 1) || !count) {
    pageInfo.hasNext = false;
  }
  if (!page) {
    pageInfo.hasPrev = false;
  }

  return pageInfo;
}
