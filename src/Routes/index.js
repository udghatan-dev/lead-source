import React, { Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

//Layouts
import NonAuthLayout from '../Layouts/NonAuthLayout';
import VerticalLayout from '../Layouts/VerticalLayouts';
import NotFound from '../pages/Error/404NotFound';
import Preloader from './../Components/Loaders/Preloader';
//routes
import { publicRoutes, productPageRoute, digRoute } from './allRoutes';
import { AuthProtected, RestrictedAccessRoute, DIGRoute } from './AuthProtected';

const Index = () => {
  const availablePublicRoutesPaths = publicRoutes.map((r) => r.path);
  const availableProductRoutesPath = productPageRoute.map((r) => r.path);
  const availableDIGRoute = digRoute.map((r) => r.path);

  return (
    <Suspense fallback={<Preloader />}>
      <React.Fragment>
        <Switch>
          <Route path={availablePublicRoutesPaths}>
            <NonAuthLayout>
              <Switch>
                {publicRoutes.map((route, idx) => (
                  <Route path={route.path} component={route.component} key={idx} exact={true} />
                ))}

                <Route component={NotFound} />
              </Switch>
            </NonAuthLayout>
          </Route>

          <Route path={availableDIGRoute}>
            <DIGRoute>
              <VerticalLayout>
                <Switch>
                  {digRoute.map((route, idx) => (
                    <RestrictedAccessRoute
                      path={route.path}
                      component={route.component}
                      permissions={route.permissions}
                      key={idx}
                      exact={true}
                    />
                  ))}

                  <Route component={NotFound} />
                </Switch>
              </VerticalLayout>
            </DIGRoute>
          </Route>

          <Route path={availableProductRoutesPath}>
            <AuthProtected>
              <VerticalLayout>
                <Switch>
                  {productPageRoute.map((route, idx) => (
                    <RestrictedAccessRoute path={route.path} component={route.component} key={idx} exact={true} />
                  ))}

                  <Route component={NotFound} />
                </Switch>
              </VerticalLayout>
            </AuthProtected>
          </Route>
        </Switch>
      </React.Fragment>
    </Suspense>
  );
};

export default Index;
