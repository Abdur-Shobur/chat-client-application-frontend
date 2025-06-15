export const dropDownList = (
	data: any[],
	valueKey: string,
	labelKey: string
) => {
	if (data?.length > 0) {
		return data?.map((item, i) => ({
			key: item.id || i,
			value: item[valueKey],
			label: item[labelKey],
		}));
	}
	return [];
};
