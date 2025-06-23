import { showToast } from './tost';

export const apiReqResponse = async (response: any) => {
	if (response.statusCode === 200 && response.status) {
		showToast({
			title: 'Success',
			description: response.message || 'Operation successful',
		});
	}
};
