type FormFieldType = "select" | "checkbox" | "text" | "url" | "textarea";

type FormField = {
	type: FormFieldType;
	label: string;
	name: string;
	defaultValue?: any;
	options?: { value: string; label: string }[];
	required?: boolean;
	conditional?: {
		field: string;
		value: any;
	};
};

type PlatformConfig = {
	fields: FormField[];
	sections: {
		title?: string;
		fields: string[];
	}[];
};

export const platformFormConfigs: Record<string, PlatformConfig> = {
	tiktok: {
		fields: [
			{
				type: "select",
				label: "Post Type",
				name: "tk_type",
				defaultValue: "video",
				options: [
					{ value: "video", label: "Video" },
					{ value: "image", label: "Image" },
				],
				required: true,
			},
			{
				type: "select",
				label: "Privacy",
				name: "tk_privacy",
				options: [
					{ value: "public", label: "Public" },
					{ value: "mutual", label: "Mutual" },
					{ value: "private", label: "Private" },
				],
				required: true,
			},
			{
				type: "checkbox",
				label: "Allow Comments",
				name: "tk_safety.allow_comments",
			},
			{
				type: "checkbox",
				label: "Allow Duets",
				name: "tk_safety.allow_duet",
			},
			{
				type: "checkbox",
				label: "Allow Stitches",
				name: "tk_safety.allow_stitch",
			},
			{
				type: "checkbox",
				label: "Self Promotion - Are you promoting something?",
				name: "tk_promotion.self_promotion",
				defaultValue: false,
			},
			{
				type: "checkbox",
				label: "Your Brand Content - Is this content from your brand?",
				name: "tk_promotion.is_your_brand_content",
				defaultValue: false,
				conditional: {
					field: "tk_promotion.self_promotion",
					value: true,
				},
			},
			{
				type: "checkbox",
				label: "Branded Content - Is this content from another brand?",
				name: "tk_promotion.is_branded_content",
				defaultValue: false,
				conditional: {
					field: "tk_promotion.self_promotion",
					value: true,
				},
			},
		],
		sections: [
			{
				fields: ["tk_type", "tk_privacy"],
			},
			{
				title: "Safety Settings",
				fields: [
					"tk_safety.allow_comments",
					"tk_safety.allow_duet",
					"tk_safety.allow_stitch",
				],
			},
			{
				title: "Promotion Settings",
				fields: [
					"tk_promotion.self_promotion",
					"tk_promotion.is_your_brand_content",
					"tk_promotion.is_branded_content",
				],
			},
		],
	},
	instagram: {
		fields: [
			{
				type: "select",
				label: "Post Type",
				name: "ig_type",
				defaultValue: "feed",
				options: [
					{ value: "feed", label: "Feed" },
					{ value: "reel", label: "Reel" },
					{ value: "story", label: "Story" },
				],
				required: true,
			},
		],
		sections: [
			{
				fields: ["ig_type"],
			},
		],
	},
	facebook: {
		fields: [
			{
				type: "select",
				label: "Post Type",
				name: "fb_type",
				defaultValue: "feed",
				options: [
					{ value: "feed", label: "Feed" },
					{ value: "reel", label: "Reel" },
				],
				required: true,
			},
			{
				type: "url",
				label: "Link (optional)",
				name: "fb_link",
			},
			{
				type: "text",
				label: "Place ID (optional)",
				name: "fb_options.reel.place_id",
				conditional: {
					field: "fb_type",
					value: "reel",
				},
			},
		],
		sections: [
			{
				fields: ["fb_type"],
			},
			{
				title: "Additional Options",
				fields: ["fb_link", "fb_options.reel.place_id"],
			},
		],
	},
	youtube: {
		fields: [
			{
				type: "textarea",
				label: "Description (optional)",
				name: "yt_description",
			},
			{
				type: "select",
				label: "Post Type",
				name: "yt_type",
				defaultValue: "standard",
				options: [
					{ value: "standard", label: "Standard" },
					{ value: "short", label: "Short" },
				],
				required: true,
			},
			{
				type: "text",
				label: "Tags (optional)",
				name: "yt_tags",
			},
			{
				type: "text",
				label: "Category ID (optional)",
				name: "yt_category_id",
			},
			{
				type: "checkbox",
				label: "Made for Kids",
				name: "yt_options.made_for_kids",
			},
			{
				type: "checkbox",
				label: "Notify Subscribers (Not recommended)",
				name: "yt_options.notify_subscribers",
			},
		],
		sections: [
			{
				fields: [
					"yt_description",
					"yt_type",
					"yt_tags",
					"yt_category_id",
					"yt_options.made_for_kids",
					"yt_options.notify_subscribers",
				],
			},
		],
	},
};
