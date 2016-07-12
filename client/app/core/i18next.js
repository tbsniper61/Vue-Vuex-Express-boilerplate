import Vue from "vue";
import { isFunction, defaultsDeep } from "lodash";
import i18next from "i18next";
import i18NextLanguageDetector from "i18next-browser-languagedetector";
import i18NextXHR from "i18next-xhr-backend";

import moment from "moment";

function install(Vue, callback, options = {}) {

	i18next
		.use(i18NextXHR)
		.use(i18NextLanguageDetector)
		.init(defaultsDeep({}, {
			//lng: "hu",
			fallbackLng: "en",
			whitelist: ["en", "hu"],
			ns: ["app"],
			defaultNS: "app",
			load: "languageOnly",
			saveMissing: true,
			saveMissingTo: "all", // "fallback", "current", "all"

			backend: {
				// path where resources get loaded from
				loadPath: "/locales/resources.json?lng={{lng}}&ns={{ns}}",

				// path to post missing resources
				addPath: "/locales/add?lng={{lng}}&ns={{ns}}",

				// server supports multiloading
					// /locales/resources.json?lng=de+en&ns=ns1+ns2
				allowMultiLoading: true,

				// allow cross domain requests
				crossDomain: false

			},

			detection: {
				order: ['querystring', 'htmlTag', 'navigator']
			}

		}), (err, t) => {
			Vue.prototype.$lng = i18next.language;
			Vue.prototype._ = (key, opts) => {
				return t(key, opts);
			};

			moment.locale(i18next.language);

			console.log("I18Next initialized! Language: " + i18next.language);
			console.log(i18next);
			console.log(t("Home"));

			if (isFunction(callback))
				callback(i18next, t);
		});

	// Register as a filter
	Vue.filter('i18n', function(value, options) {
		return i18next.t(value, options);
	});

	// Register as a directive
	Vue.directive('i18n', {
		bind: function() {
			this.el.innerHTML = i18next.t(this.expression);
		}
	});	

	Vue.prototype.$i18n = i18next;
	Vue.prototype._ = (key, opts) => {
		return i18next.t(key, opts);
	};
}

module.exports = {
	install
}