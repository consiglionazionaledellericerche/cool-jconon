package it.cnr.cool.web.servlet.handler;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.http.HttpStatus;
import org.springframework.web.context.request.WebRequestInterceptor;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.MappedInterceptor;
import org.springframework.web.servlet.handler.SimpleMappingExceptionResolver;
import org.springframework.web.servlet.handler.WebRequestHandlerInterceptorAdapter;

public class MappingExceptionResolver extends SimpleMappingExceptionResolver implements InitializingBean{
	private List<Object> interceptors = new ArrayList<Object>();
	private final List<HandlerInterceptor> adaptedInterceptors = new ArrayList<HandlerInterceptor>();
	private final List<MappedInterceptor> mappedInterceptors = new ArrayList<MappedInterceptor>();
	private String defaultErrorViewAjax;
	
	public void setDefaultErrorViewAjax(String defaultErrorViewAjax) {
		this.defaultErrorViewAjax = defaultErrorViewAjax;
	}

	public void setInterceptors(List<Object> interceptors) {
		this.interceptors = interceptors;
	}

	protected void initInterceptors() {
		if (!this.interceptors.isEmpty()) {
			for (int i = 0; i < this.interceptors.size(); i++) {
				Object interceptor = this.interceptors.get(i);
				if (interceptor == null) {
					throw new IllegalArgumentException("Entry number " + i + " in interceptors array is null");
				}
				if (interceptor instanceof MappedInterceptor) {
					mappedInterceptors.add((MappedInterceptor) interceptor);
				}
				else {
					adaptedInterceptors.add(adaptInterceptor(interceptor));
				}
			}
		}
	}

	protected HandlerInterceptor adaptInterceptor(Object interceptor) {
		if (interceptor instanceof HandlerInterceptor) {
			return (HandlerInterceptor) interceptor;
		}
		else if (interceptor instanceof WebRequestInterceptor) {
			return new WebRequestHandlerInterceptorAdapter((WebRequestInterceptor) interceptor);
		}
		else {
			throw new IllegalArgumentException("Interceptor type not supported: " + interceptor.getClass().getName());
		}
	}
	
	@Override
	protected String determineViewName(Exception ex, HttpServletRequest request) {
		if (Boolean.valueOf(request.getParameter("ajax")))
			return defaultErrorViewAjax;
		return super.determineViewName(ex, request);
	}
	
	@Override
	protected ModelAndView doResolveException(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception ex) {
		if (adaptedInterceptors != null) {
			for (HandlerInterceptor interceptor : adaptedInterceptors) {
				try {
					if (!interceptor.preHandle(request, response, interceptor)) {
						return null;
					}
				} catch (Exception e) {
					throw new RuntimeException(ex);
				}
			}
		}		
		ModelAndView mv = super.doResolveException(request, response, handler, ex);
		if (adaptedInterceptors != null) {
			for (HandlerInterceptor interceptor : adaptedInterceptors) {
				try {
					interceptor.postHandle(request, response, interceptor, mv);
				} catch (Exception e) {
					throw new RuntimeException(ex);
				}
			}
		}		
		response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
		return mv;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		initInterceptors();
	}

}
